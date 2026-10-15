import { act, renderHook, waitFor } from "@testing-library/react";
import { NextRouter, useRouter } from "next/router.js";
import { afterEach, beforeEach, expect, expectTypeOf, test, vi } from "vitest";

import useIndexPageLoadingAndQueryLogic, {
  IndexPageGetPreviewsAndHasNextPage,
  IndexPageQueryInfo,
} from "./useIndexPageLoadingAndQueryLogic.js";

vi.mock("next/router.js", () => ({ useRouter: vi.fn() }));

type TestNormalizedQuery = { count: number; tag: null | string };
type TestPreview = { id: string };

const previewsPerPage = 3;

const getTestPreview = (previewNumber: number): TestPreview => ({
  id: `preview-${previewNumber}`,
});

const testPreviews = Array.from({ length: previewsPerPage * 2 }, (_, index) =>
  getTestPreview(index + 1),
);

const initialPreviews = testPreviews.slice(0, previewsPerPage);

const getPreviewElementId = (preview: TestPreview) => `Preview-${preview.id}`;

const getPageNormalizedQuery = (
  query: NextRouter["query"],
): TestNormalizedQuery => ({
  count: Number(query.count ?? previewsPerPage),
  tag: typeof query.tag === "string" ? query.tag : null,
});

let router: Pick<NextRouter, "asPath" | "query" | "replace">;

beforeEach(() => {
  router = {
    asPath: "/index-page",
    query: {},
    replace: vi.fn().mockResolvedValue(true),
  };
  vi.mocked(useRouter).mockImplementation(() => router as NextRouter);
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

/**
 * Render the hook with previewsPerPage items displayed, returning a function
 * that changes the router query. Each item is rendered as an element with its
 * preview element ID, so it can be focused.
 */
const renderUseIndexPageLoadingAndQueryLogic = ({
  getPreviewsAndHasNextPage,
}: {
  getPreviewsAndHasNextPage: IndexPageGetPreviewsAndHasNextPage<
    TestNormalizedQuery,
    TestPreview
  >;
}) => {
  const announceLoadingNewItemsComplete =
    vi.fn<(args: { count: number }) => void>();
  const announceLoadingNewItemsStarted = vi.fn<() => void>();

  const hook = renderHook(() => {
    const result = useIndexPageLoadingAndQueryLogic({
      // Inline functions are deliberately recreated on every render
      announceLoadingNewItemsComplete: (args: { count: number }) =>
        announceLoadingNewItemsComplete(args),
      announceLoadingNewItemsStarted: () => announceLoadingNewItemsStarted(),
      getPageNormalizedQuery: (query) => getPageNormalizedQuery(query),
      getPreviewElementId,
      getPreviewsAndHasNextPage: (queryInfo) =>
        getPreviewsAndHasNextPage(queryInfo),
      initialHasNextPage: true,
      initialPreviews,
      localeCode: "en",
    });

    document.body.innerHTML = result.previews
      .map((preview) => `<div id="${getPreviewElementId(preview)}"></div>`)
      .join("");

    return result;
  });

  const setQuery = (query: NextRouter["query"]) => {
    router = { ...router, query };
    hook.rerender();
  };

  return {
    announceLoadingNewItemsComplete,
    announceLoadingNewItemsStarted,
    result: hook.result,
    setQuery,
  };
};

test("replaces the initial route with a shallow route without fetching", () => {
  const getPreviewsAndHasNextPage = vi.fn();

  const { result } = renderUseIndexPageLoadingAndQueryLogic({
    getPreviewsAndHasNextPage,
  });

  expect(router.replace).toHaveBeenCalledOnce();
  expect(getPreviewsAndHasNextPage).not.toHaveBeenCalled();
  expect(result.current.previews).toBe(initialPreviews);
  expect(result.current.indexPageLoadingState).toEqual({ type: "hasMore" });
});

test("loads a new set of items when a filter changes", async () => {
  const getPreviewsAndHasNextPage = vi.fn().mockResolvedValue({
    hasNextPage: false,
    previews: [getTestPreview(10)],
  });

  const {
    announceLoadingNewItemsComplete,
    announceLoadingNewItemsStarted,
    result,
    setQuery,
  } = renderUseIndexPageLoadingAndQueryLogic({ getPreviewsAndHasNextPage });

  setQuery({ tag: "news" });

  expect(result.current.indexPageLoadingState).toEqual({ type: "loadingNew" });
  expect(announceLoadingNewItemsStarted).toHaveBeenCalledOnce();

  await waitFor(() => {
    expect(result.current.previews).toEqual([getTestPreview(10)]);
  });

  expect(getPreviewsAndHasNextPage).toHaveBeenCalledExactlyOnceWith({
    isLoadMoreQuery: false,
    localeCode: "en",
    normalizedQuery: { count: previewsPerPage, tag: "news" },
    normalizedQueryHasChanged: true,
  });
  expect(result.current.indexPageLoadingState).toEqual({ type: "hasNoMore" });
  expect(result.current.previewsQueryInfo.normalizedQuery.tag).toBe("news");
  expect(announceLoadingNewItemsComplete).toHaveBeenCalledExactlyOnceWith({
    count: 1,
  });
});

test("sets hasNone if a new set of items is empty", async () => {
  const { result, setQuery } = renderUseIndexPageLoadingAndQueryLogic({
    getPreviewsAndHasNextPage: vi
      .fn()
      .mockResolvedValue({ hasNextPage: false, previews: [] }),
  });

  setQuery({ tag: "empty" });

  await waitFor(() => {
    expect(result.current.indexPageLoadingState).toEqual({ type: "hasNone" });
  });
});

test("appends more items and focuses the first one", async () => {
  const { announceLoadingNewItemsComplete, result, setQuery } =
    renderUseIndexPageLoadingAndQueryLogic({
      getPreviewsAndHasNextPage: vi.fn().mockResolvedValue({
        hasNextPage: false,
        previews: testPreviews.slice(previewsPerPage),
      }),
    });

  setQuery({ count: String(previewsPerPage * 2) });

  expect(result.current.indexPageLoadingState).toEqual({
    type: "loadingMore",
  });

  await waitFor(() => {
    expect(result.current.previews).toEqual(testPreviews);
  });

  expect(document.activeElement?.id).toBe(
    getPreviewElementId(getTestPreview(previewsPerPage + 1)),
  );
  expect(announceLoadingNewItemsComplete).toHaveBeenCalledExactlyOnceWith({
    count: previewsPerPage,
  });
});

// A page component that clamps its count (e.g. to an API item limit that isn’t
// a multiple of its page size) requests an offset lower than the number of
// displayed items, so the response starts with items the user can already see.
// Focusing those would move focus backwards.
test("focuses the first item a load more response adds when it overlaps displayed items", async () => {
  const { announceLoadingNewItemsComplete, result, setQuery } =
    renderUseIndexPageLoadingAndQueryLogic({
      getPreviewsAndHasNextPage: vi.fn().mockResolvedValue({
        hasNextPage: false,
        previews: testPreviews.slice(1, previewsPerPage + 1),
      }),
    });

  setQuery({ count: String(previewsPerPage + 1) });

  await waitFor(() => {
    expect(result.current.previews).toEqual(
      testPreviews.slice(0, previewsPerPage + 1),
    );
  });

  expect(document.activeElement?.id).toBe(
    getPreviewElementId(getTestPreview(previewsPerPage + 1)),
  );
  expect(announceLoadingNewItemsComplete).toHaveBeenCalledExactlyOnceWith({
    count: 1,
  });
});

test("ignores outdated responses", async () => {
  let resolveFirstRequest: (value: {
    hasNextPage: boolean;
    previews: Array<TestPreview>;
  }) => void = () => {};

  const getPreviewsAndHasNextPage = vi
    .fn()
    .mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFirstRequest = resolve;
      }),
    )
    .mockResolvedValueOnce({
      hasNextPage: false,
      previews: [getTestPreview(20)],
    });

  const { result, setQuery } = renderUseIndexPageLoadingAndQueryLogic({
    getPreviewsAndHasNextPage,
  });

  setQuery({ tag: "first" });
  setQuery({ tag: "second" });

  await waitFor(() => {
    expect(result.current.previews).toEqual([getTestPreview(20)]);
  });

  await act(async () => {
    resolveFirstRequest({ hasNextPage: false, previews: [getTestPreview(10)] });
    await Promise.resolve();
  });

  expect(result.current.previews).toEqual([getTestPreview(20)]);
  expect(result.current.previewsQueryInfo.normalizedQuery.tag).toBe("second");
});

test("sets error state if the request fails", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});

  const { result, setQuery } = renderUseIndexPageLoadingAndQueryLogic({
    getPreviewsAndHasNextPage: vi.fn().mockRejectedValue(new Error("Timeout")),
  });

  setQuery({ tag: "news" });

  await waitFor(() => {
    expect(result.current.indexPageLoadingState).toEqual({ type: "error" });
  });

  expect(result.current.previews).toBe(initialPreviews);
});

test("doesn’t refetch when callbacks change but the query doesn’t", async () => {
  const getPreviewsAndHasNextPage = vi.fn().mockResolvedValue({
    hasNextPage: false,
    previews: [getTestPreview(10)],
  });

  const { result, setQuery } = renderUseIndexPageLoadingAndQueryLogic({
    getPreviewsAndHasNextPage,
  });

  setQuery({ tag: "news" });

  await waitFor(() => {
    expect(result.current.previews).toEqual([getTestPreview(10)]);
  });

  // Re-render with an equal (but not identical) query object
  setQuery({ tag: "news" });

  expect(getPreviewsAndHasNextPage).toHaveBeenCalledOnce();
});

test("infers its type parameters from the options", () => {
  type TestLocaleCode = "en" | "fa";

  const getPreviewsAndHasNextPage: IndexPageGetPreviewsAndHasNextPage<
    TestNormalizedQuery,
    TestPreview,
    TestLocaleCode
  > = () => Promise.resolve({ hasNextPage: false, previews: [] });

  // As a project’s locale store would type it
  const getLocaleCode = (): TestLocaleCode => "en";

  const { result } = renderHook(() =>
    useIndexPageLoadingAndQueryLogic({
      announceLoadingNewItemsComplete: () => {},
      announceLoadingNewItemsStarted: () => {},
      getPageNormalizedQuery,
      getPreviewElementId,
      getPreviewsAndHasNextPage,
      initialHasNextPage: false,
      initialPreviews,
      localeCode: getLocaleCode(),
    }),
  );

  expectTypeOf(result.current.previews).toEqualTypeOf<Array<TestPreview>>();
  expectTypeOf(result.current.queryInfo).toEqualTypeOf<
    IndexPageQueryInfo<TestNormalizedQuery, TestLocaleCode>
  >();
});
