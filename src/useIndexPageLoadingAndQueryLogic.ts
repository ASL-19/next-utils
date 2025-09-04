import { focusElement } from "@asl-19/js-dom-utils";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router.js";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useRef, useState } from "react";

import replaceCurrentRouteWithShallowRoute from "./replaceCurrentRouteWithShallowRoute";

/**
 * Index page getPreviewsAndHasNextPage function.
 *
 * @public
 */
export type IndexPageGetPreviewsAndHasNextPage<PageNormalizedQuery, Preview> = (
  queryInfo: IndexPageQueryInfo<PageNormalizedQuery>,
) => Promise<{
  hasNextPage: boolean;
  previews: Array<Preview>;
}>;

/**
 * Index page loading state. One of these possible types:
 *
 * - `error`: Encountered an error/timeout while loading new items
 * - `loadingNew`: Loading a new set of items (because filter/ordering changed)
 * - `loadingMore`: Loading more of the current set of items
 * - `hasMore`: Has more items to load (should show "Load more" link)
 * - `hasNoMore`: Has no more items to load (should NOT show load more link)
 * - `hasNone`: Has no items (should show "No items" message)
 *
 * @public
 */
export type IndexPageLoadingState =
  | { type: "error" }
  | { type: "hasMore" }
  | { type: "hasNoMore" }
  | { type: "hasNone" }
  | { type: "loadingMore" }
  | { type: "loadingNew" };

/**
 * Index page query info.
 *
 * This is used to update indexPageLoadingState, and is passed to
 * getPreviewsAndHasNextPage.
 *
 * @public
 */
export type IndexPageQueryInfo<PageNormalizedQuery> = {
  isLoadMoreQuery: boolean;
  localeCode: string;
  normalizedQuery: PageNormalizedQuery;
  normalizedQueryHasChanged?: boolean;
};

/**
 * Fetch and display new items when query changes.
 *
 * Takes two type parameters:
 *
 * 1. The page’s NormalizedQuery type.
 * 2. The page’s preview item type (i.e. the type set by `setPreviews`, and the
 *    type fetched by `fetchNewItems`)
 *
 * @public
 *
 */
const useIndexPageLoadingAndQueryLogic = <
  PageNormalizedQuery extends { count: number },
  Preview extends { id: string },
>({
  announceLoadingNewItemsComplete,
  announceLoadingNewItemsStarted,
  getPageNormalizedQuery,
  getPreviewElementId,
  getPreviewsAndHasNextPage,
  initialHasNextPage,
  initialPreviews,
  localeCode,
  queryKeyPrefix,
}: {
  announceLoadingNewItemsComplete: ({ count }: { count: number }) => void;

  announceLoadingNewItemsStarted: () => void;

  /**
   * Function that converts a Next-provided query to a normalized query.
   */
  getPageNormalizedQuery: (query: ParsedUrlQuery) => PageNormalizedQuery;

  /**
   * Function that returns the HTML ID of a given preview item.
   *
   * This is used to focus the first new item after more items are loaded.
   */
  getPreviewElementId: (preview: Preview) => string;

  /**
   * Function that fetches the new previews and returns an object containing:
   *
   * - `hasNextPage`: Did the query response indicate that there’s another page
   *   of results?
   *
   *   This will probably look like `!!response.items?.pageInfo.hasNextPage`
   *
   * - `newPreviews`: Array of new preview items
   *
   *   This must match the provided `Preview` type.
   */
  getPreviewsAndHasNextPage: IndexPageGetPreviewsAndHasNextPage<
    PageNormalizedQuery,
    Preview
  >;

  /**
   * Did the query response indicate that there’s another page of results?
   */
  initialHasNextPage: boolean;

  /**
   * Initial previews
   */
  initialPreviews: Array<Preview>;

  localeCode: string;

  /**
   * Prefix for TanStack Query queryKeys.
   */
  queryKeyPrefix: string;
}) => {
  // ---------------------
  // --- Outside state ---
  // ---------------------

  const router = useRouter();

  // -------------
  // --- State ---
  // -------------

  const [isLeavingPage, setIsLeavingPage] = useState(false);

  const [previews, setPreviews] = useState(initialPreviews);

  const [indexPageLoadingState, setIndexPageLoadingState] =
    useState<IndexPageLoadingState>(
      initialPreviews.length === 0
        ? { type: "hasNone" }
        : initialHasNextPage
          ? { type: "hasMore" }
          : { type: "hasNoMore" },
    );

  const [queryInfo, setQueryInfo] = useState<
    IndexPageQueryInfo<PageNormalizedQuery>
  >({
    /**
     * Is query loading more items (IndexPageLoadingState.loadingMore), or
     * loading new items (IndexPageLoadingState.loadingNew)?
     */
    isLoadMoreQuery: false,

    localeCode,

    /**
     * Normalized query.
     */
    normalizedQuery: getPageNormalizedQuery(router.query),

    normalizedQueryHasChanged: false,
  });

  const [focusElementId, setFocusElementId] = useState<null | string>(null);

  // ------------------------------------------------------
  // --- Replace the initial route with a shallow route ---
  // ------------------------------------------------------

  // If we didn’t replace the initial route Next.js would do an unnecessary
  // full page load (running getServerSideProps and displaying the global
  // loading indicator rather than the page-specific loading indicator) if
  // the user navigated back to the initial ProfilesPage route via the back
  // button/gesture
  //
  // See replaceCurrentRouteWithShallowRoute for more details.

  const hasReplacedInitialRouteWithShallowRoute = useRef(false);

  useEffect(() => {
    if (
      !queryInfo.normalizedQueryHasChanged &&
      !hasReplacedInitialRouteWithShallowRoute.current
    ) {
      hasReplacedInitialRouteWithShallowRoute.current = true;

      void replaceCurrentRouteWithShallowRoute({ router });
    }
  }, [queryInfo.normalizedQueryHasChanged, router]);

  // ----------------------------------------------------------------------
  // --- Set isLeavingPage to true when non-shallow route change starts ---
  // ----------------------------------------------------------------------
  // This is used to prevent fetching new items when the user is navigating
  // away from the page.

  useEffect(() => {
    const onRouteChangeStart = (
      _url: string,
      { shallow }: { shallow: boolean },
    ) => {
      if (!shallow) {
        setIsLeavingPage(true);
      }
    };

    router.events.on("routeChangeStart", onRouteChangeStart);

    return () => {
      router.events.off("routeChangeStart", onRouteChangeStart);
    };
  }, [router.events]);

  // -----------------------------------------------
  // --- Update queryInfo on router.query change ---
  // -----------------------------------------------

  useEffect(() => {
    setQueryInfo((previousQueryInfo) => {
      const previousNormalizedQuery = previousQueryInfo.normalizedQuery;

      const normalizedQuery = getPageNormalizedQuery(router.query);

      // If the query hasn’t changed don’t unnecessarily update queryInfo
      // (queryInfo is initialized based on initialNormalizedQuery).
      if (
        JSON.stringify(normalizedQuery) ===
        JSON.stringify(previousQueryInfo.normalizedQuery)
      ) {
        return previousQueryInfo;
      }

      // The query is loading more if the query’s filter properties are the same
      // as the previous query’s filter properties, and the query’s count property is
      // higher than the previous query’s count property
      const isLoadMoreQuery = (
        Object.keys(normalizedQuery) as Array<keyof PageNormalizedQuery>
      ).every((queryKey) =>
        queryKey === "count"
          ? normalizedQuery.count > previousNormalizedQuery.count
          : normalizedQuery[queryKey] === previousNormalizedQuery[queryKey],
      );

      return {
        isLoadMoreQuery,
        localeCode,
        normalizedQuery,
        normalizedQueryHasChanged: true,
      };
    });
  }, [getPageNormalizedQuery, localeCode, router.query]);

  // ----------------------------------------------------------
  // --- Fetch and display new items when queryInfo changes ---
  // ----------------------------------------------------------

  const result = useQuery<
    { hasNextPage: boolean; previews: Array<Preview> },
    unknown
  >({
    enabled: queryInfo.normalizedQueryHasChanged && !isLeavingPage,
    queryFn: async () => {
      announceLoadingNewItemsStarted();
      const data = await getPreviewsAndHasNextPage(queryInfo);
      return data;
    },
    queryKey: [queryKeyPrefix, queryInfo],
  });

  useEffect(() => {
    if (result.fetchStatus === "fetching") {
      setIndexPageLoadingState(
        queryInfo.isLoadMoreQuery
          ? { type: "loadingMore" }
          : { type: "loadingNew" },
      );
      return;
    }

    if (result.status === "pending") {
      console.info(
        "[useIndexPageLoadingAndQueryLogic] Query pending, ignoring result",
      );
      return;
    }

    if (result.status === "error") {
      console.error(
        "[useIndexPageLoadingAndQueryLogic] Error while loading items:",
        result.error,
      );
      setIndexPageLoadingState({ type: "error" });
      return;
    }

    console.info("[useIndexPageLoadingAndQueryLogic] Finished loading items");

    setPreviews((previousPreviews) =>
      queryInfo.isLoadMoreQuery
        ? [
            ...previousPreviews,
            ...result.data.previews.filter(
              (newPreview) =>
                !previousPreviews.some(
                  (previousPreview) => newPreview.id === previousPreview.id,
                ),
            ),
          ]
        : result.data.previews,
    );

    setIndexPageLoadingState(
      !queryInfo.isLoadMoreQuery && result.data.previews.length === 0
        ? { type: "hasNone" }
        : result.data.hasNextPage
          ? { type: "hasMore" }
          : { type: "hasNoMore" },
    );

    announceLoadingNewItemsComplete({ count: result.data.previews.length });

    if (queryInfo.isLoadMoreQuery && result.data.previews[0]) {
      setFocusElementId(getPreviewElementId(result.data.previews[0]));
    }
  }, [
    result.data,
    result.fetchStatus,
    result.error,
    result.status,
    announceLoadingNewItemsComplete,
    getPreviewElementId,
    queryInfo,
  ]);

  // -----------------------------------------
  // --- Focus focusElementId when updated ---
  // -----------------------------------------
  useEffect(() => {
    if (focusElementId) {
      focusElement(document.getElementById(focusElementId), {
        preventScroll: true,
      });
    }
  }, [focusElementId]);

  return {
    indexPageLoadingState,
    previews,
    queryInfo,
  };
};

export default useIndexPageLoadingAndQueryLogic;
