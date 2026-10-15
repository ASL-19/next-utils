import { focusElement } from "@asl-19/js-dom-utils";
import { NextRouter, useRouter } from "next/router.js";
import { useEffect, useRef, useState } from "react";

import replaceCurrentRouteWithShallowRoute from "./replaceCurrentRouteWithShallowRoute.js";

/**
 * Index page getPreviewsAndHasNextPage function.
 *
 * @public
 */
export type IndexPageGetPreviewsAndHasNextPage<
  PageNormalizedQuery,
  Preview,
  LocaleCode extends string = string,
> = (
  queryInfo: IndexPageQueryInfo<PageNormalizedQuery, LocaleCode>,
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
 * - `hasMore`: Has more items to load (should show “Load more” link)
 * - `hasNoMore`: Has no more items to load (should NOT show load more link)
 * - `hasNone`: Has no items (should show “No items” message)
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
export type IndexPageQueryInfo<
  PageNormalizedQuery,
  LocaleCode extends string = string,
> = {
  /**
   * Is query loading more items (`loadingMore`), or loading new items
   * (`loadingNew`)?
   */
  isLoadMoreQuery: boolean;
  localeCode: LocaleCode;
  normalizedQuery: PageNormalizedQuery;
  /**
   * Has the normalized query changed since initial render?
   */
  normalizedQueryHasChanged?: boolean;
};

/**
 * Fetch and display new items when the router query changes.
 *
 * @remarks
 * Takes three type parameters, which are inferred from the options, so they
 * don’t need to be passed explicitly:
 *
 * 1. `PageNormalizedQuery`: The page’s normalized query type (inferred from
 *    `getPageNormalizedQuery`). Its `count` property is the number of items to
 *    display, so a query that only increases `count` loads more items, and any
 *    other change loads a new set of items.
 * 2. `Preview`: The page’s preview item type (inferred from `initialPreviews`)
 * 3. `LocaleCode`: The project’s locale code type (inferred from `localeCode`)
 *
 * TypeScript can’t infer some type parameters and take others explicitly, so
 * if you pass the first two you also need to pass `LocaleCode`; otherwise it
 * defaults to `string`.
 *
 * The callbacks don’t need to be memoized: the hook always calls the latest
 * ones, and only fetches when the normalized query changes.
 *
 * Responses to outdated requests (e.g. if the user changed a filter while the
 * previous request was loading, or left the page) are ignored.
 *
 * @param options - Hook options
 * @param options.announceLoadingNewItemsComplete - Function that announces (to
 * screen readers) that loading finished, and how many items were added
 * @param options.announceLoadingNewItemsStarted - Function that announces (to
 * screen readers) that loading started
 * @param options.getPageNormalizedQuery - Function that converts a
 * Next-provided query to a normalized query
 * @param options.getPreviewElementId - Function that returns the HTML ID of a
 * given preview item. This is used to focus the first new item after more items
 * are loaded
 * @param options.getPreviewsAndHasNextPage - Function that fetches the previews
 * for a query, and returns them with whether the response indicated there’s
 * another page of results (e.g. `!!response.items?.pageInfo.hasNextPage`)
 * @param options.initialHasNextPage - Did the initial response indicate that
 * there’s another page of results?
 * @param options.initialPreviews - Initial preview items
 * @param options.localeCode - Current locale code, passed to
 * `getPreviewsAndHasNextPage` in `queryInfo`
 *
 * @example
 * ```tsx
 * type BlogPageNormalizedQuery = { count: number; topic: string };
 *
 * const getBlogPageNormalizedQuery = (
 *   query: NextRouter["query"],
 * ): BlogPageNormalizedQuery => ({
 *   count: Number(query.count) || postsPerPage,
 *   topic: typeof query.topic === "string" ? query.topic : "",
 * });
 *
 * // Defined outside the component, though inline functions work too
 * const getBlogPagePreviewsAndHasNextPage: IndexPageGetPreviewsAndHasNextPage<
 *   BlogPageNormalizedQuery,
 *   PostPreview,
 *   LocaleCode
 * > = async ({ localeCode, normalizedQuery }) => {
 *   const response = await graphQlSdk.getPosts({
 *     first: normalizedQuery.count,
 *     localeCode,
 *     topic: normalizedQuery.topic,
 *   });
 *
 *   return {
 *     hasNextPage: !!response.posts?.pageInfo.hasNextPage,
 *     previews: response.posts?.edges.map((edge) => edge.node) ?? [],
 *   };
 * };
 *
 * const BlogPage = ({ initialHasNextPage, initialPreviews }: BlogPageProps) => {
 *   const { localeCode } = useLocaleInfo();
 *
 *   const { indexPageLoadingState, previews, previewsQueryInfo } =
 *     useIndexPageLoadingAndQueryLogic({
 *       announceLoadingNewItemsComplete: ({ count }) => {
 *         announce({ text: `Loaded ${count} items` });
 *       },
 *       announceLoadingNewItemsStarted: () => {
 *         announce({ text: "Loading new items" });
 *       },
 *       getPageNormalizedQuery: getBlogPageNormalizedQuery,
 *       getPreviewElementId: (preview) => `PostPreview-${preview.id}`,
 *       getPreviewsAndHasNextPage: getBlogPagePreviewsAndHasNextPage,
 *       initialHasNextPage,
 *       initialPreviews,
 *       localeCode,
 *     });
 *
 *   // Render previews (each with the ID from getPreviewElementId), the current
 *   // topic from previewsQueryInfo.normalizedQuery.topic, and a loading
 *   // indicator, “Load more” link (to the same URL with a higher count), or
 *   // error/empty message based on indexPageLoadingState.type
 * };
 * ```
 *
 * @public
 */
const useIndexPageLoadingAndQueryLogic = <
  PageNormalizedQuery extends { count: number },
  Preview extends { id: string },
  LocaleCode extends string = string,
>({
  announceLoadingNewItemsComplete,
  announceLoadingNewItemsStarted,
  getPageNormalizedQuery,
  getPreviewElementId,
  getPreviewsAndHasNextPage,
  initialHasNextPage,
  initialPreviews,
  localeCode,
}: {
  announceLoadingNewItemsComplete: ({ count }: { count: number }) => void;
  announceLoadingNewItemsStarted: () => void;
  getPageNormalizedQuery: (query: NextRouter["query"]) => PageNormalizedQuery;
  getPreviewElementId: (preview: Preview) => string;
  getPreviewsAndHasNextPage: IndexPageGetPreviewsAndHasNextPage<
    PageNormalizedQuery,
    Preview,
    LocaleCode
  >;
  initialHasNextPage: boolean;
  initialPreviews: Array<Preview>;
  localeCode: LocaleCode;
}) => {
  // ---------------------
  // --- Outside state ---
  // ---------------------

  const router = useRouter();

  // Store the callbacks in a ref so the effects below always call the latest
  // ones without depending on them. Otherwise a callback that isn’t memoized
  // (or whose dependencies change) would trigger a refetch on every render,
  // which could loop forever since each response re-renders the page.
  //
  // This effect is declared before the effects that read the ref, so it runs
  // first.
  const callbacksRef = useRef({
    announceLoadingNewItemsComplete,
    announceLoadingNewItemsStarted,
    getPageNormalizedQuery,
    getPreviewElementId,
    getPreviewsAndHasNextPage,
  });

  useEffect(() => {
    callbacksRef.current = {
      announceLoadingNewItemsComplete,
      announceLoadingNewItemsStarted,
      getPageNormalizedQuery,
      getPreviewElementId,
      getPreviewsAndHasNextPage,
    };
  });

  // -------------
  // --- State ---
  // -------------

  const [previews, setPreviews] = useState(initialPreviews);

  // Mirror of previews, updated wherever previews is set. This lets the request
  // completion logic below compare a response against the currently displayed
  // items without adding previews to the fetching useEffect’s dependencies
  // (which would refetch every time previews changed).
  const previewsRef = useRef(initialPreviews);

  const [indexPageLoadingState, setIndexPageLoadingState] =
    useState<IndexPageLoadingState>(
      initialPreviews.length === 0
        ? { type: "hasNone" }
        : initialHasNextPage
          ? { type: "hasMore" }
          : { type: "hasNoMore" },
    );

  const [queryInfo, setQueryInfo] = useState<
    IndexPageQueryInfo<PageNormalizedQuery, LocaleCode>
  >(() => ({
    isLoadMoreQuery: false,
    localeCode,
    normalizedQuery: getPageNormalizedQuery(router.query),
    normalizedQueryHasChanged: false,
  }));

  // Query info of the currently displayed previews. Unlike queryInfo, this is
  // only updated once a response is displayed, so it can be used to render
  // things that should match the previews (e.g. the name of the current
  // filter) rather than the pending query.
  const [previewsQueryInfo, setPreviewsQueryInfo] = useState(queryInfo);

  const [focusElementId, setFocusElementId] = useState<null | string>(null);

  // ------------------------------------------------------
  // --- Replace the initial route with a shallow route ---
  // ------------------------------------------------------

  // If we didn’t replace the initial route Next.js would do an unnecessary
  // full page load (running getServerSideProps and displaying the global
  // loading indicator rather than the page-specific loading indicator) if
  // the user navigated back to the initial route via the back button/gesture
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

  // -----------------------------------------------
  // --- Update queryInfo on router.query change ---
  // -----------------------------------------------

  useEffect(() => {
    setQueryInfo((previousQueryInfo) => {
      const previousNormalizedQuery = previousQueryInfo.normalizedQuery;

      const normalizedQuery = callbacksRef.current.getPageNormalizedQuery(
        router.query,
      );

      // If the query hasn’t changed don’t unnecessarily update queryInfo
      // (queryInfo is initialized based on the initial router query).
      if (
        JSON.stringify(normalizedQuery) ===
        JSON.stringify(previousNormalizedQuery)
      ) {
        return previousQueryInfo;
      }

      // The query is loading more if the query’s filter properties are the same
      // as the previous query’s filter properties, and the query’s count
      // property is higher than the previous query’s count property. Values are
      // compared as JSON so array values (e.g. multiple selected tags) with the
      // same items are equal.
      const isLoadMoreQuery = (
        Object.keys(normalizedQuery) as Array<keyof PageNormalizedQuery>
      ).every((queryKey) =>
        queryKey === "count"
          ? normalizedQuery.count > previousNormalizedQuery.count
          : JSON.stringify(normalizedQuery[queryKey]) ===
            JSON.stringify(previousNormalizedQuery[queryKey]),
      );

      return {
        isLoadMoreQuery,
        localeCode,
        normalizedQuery,
        normalizedQueryHasChanged: true,
      };
    });
  }, [localeCode, router.query]);

  // ----------------------------------------------------------
  // --- Fetch and display new items when queryInfo changes ---
  // ----------------------------------------------------------

  useEffect(() => {
    // Don’t perform any data fetching if the normalized query hasn’t changed
    // since initial render.
    if (!queryInfo.normalizedQueryHasChanged) {
      return;
    }

    const {
      announceLoadingNewItemsComplete,
      announceLoadingNewItemsStarted,
      getPreviewElementId,
      getPreviewsAndHasNextPage,
    } = callbacksRef.current;

    // Is this an outdated request?
    //
    // The cleanup function returned at the bottom of this effect runs right
    // before the effect runs again (when queryInfo changes), and when the
    // component unmounts (when the user leaves the page). Setting isOutdated
    // there means we don’t update the page based on an outdated response: API
    // responses don’t necessarily arrive in the order they were requested, so
    // doing so could display the wrong items.
    const request = { isOutdated: false };

    void (async () => {
      announceLoadingNewItemsStarted();

      setIndexPageLoadingState(
        queryInfo.isLoadMoreQuery
          ? { type: "loadingMore" }
          : { type: "loadingNew" },
      );

      try {
        const { hasNextPage, previews } =
          await getPreviewsAndHasNextPage(queryInfo);

        if (request.isOutdated) {
          return;
        }

        // If this is a load more query the items it added are the response’s
        // items with the already-displayed ones filtered out. A response can
        // overlap the displayed items if e.g. the editors added or removed
        // items between the previous and current request, or if the page
        // component requested an offset lower than the number of displayed
        // items (e.g. if it clamps count to an API item limit that isn’t a
        // multiple of its page size).
        const addedPreviews = queryInfo.isLoadMoreQuery
          ? previews.filter(
              (newPreview) =>
                !previewsRef.current.some(
                  (displayedPreview) => displayedPreview.id === newPreview.id,
                ),
            )
          : previews;

        previewsRef.current = queryInfo.isLoadMoreQuery
          ? [...previewsRef.current, ...addedPreviews]
          : addedPreviews;

        setPreviews(previewsRef.current);

        setPreviewsQueryInfo(queryInfo);

        setIndexPageLoadingState(
          // If this isn’t a “load more” request and the response contains no
          // items then there are no items (we don’t want all of the existing
          // items hidden from the user if just the “load more” query doesn’t
          // have any items).
          !queryInfo.isLoadMoreQuery && previews.length === 0
            ? { type: "hasNone" }
            : hasNextPage
              ? { type: "hasMore" }
              : { type: "hasNoMore" },
        );

        announceLoadingNewItemsComplete({ count: addedPreviews.length });

        // If this is a “load more” query focus the first item the response
        // added (which isn’t necessarily its first item; see addedPreviews
        // above — focusing an item that was already displayed would move the
        // user’s focus backwards).
        //
        // It’s important to focus something since the user’s previous focus
        // was on the “load more” link, which disappeared during loading. This
        // also follows their intent to load more items.
        if (queryInfo.isLoadMoreQuery && addedPreviews[0]) {
          setFocusElementId(getPreviewElementId(addedPreviews[0]));
        }
      } catch (error) {
        if (request.isOutdated) {
          return;
        }

        // The error could have been triggered by e.g. a request timeout, a
        // backend failure, a frontend logic mistake, or a network failure. We
        // don’t bother trying to differentiate between them.
        console.error(
          "[useIndexPageLoadingAndQueryLogic] Error while loading items:",
          error,
        );
        setIndexPageLoadingState({ type: "error" });
      }
    })();

    return () => {
      request.isOutdated = true;
    };
  }, [queryInfo]);

  // -----------------------------------------
  // --- Focus focusElementId when updated ---
  // -----------------------------------------

  useEffect(() => {
    const element = focusElementId && document.getElementById(focusElementId);

    if (element) {
      focusElement(element, { preventScroll: true });
    }
  }, [focusElementId]);

  return {
    indexPageLoadingState,
    previews,
    previewsQueryInfo,
    queryInfo,
  };
};

export default useIndexPageLoadingAndQueryLogic;
