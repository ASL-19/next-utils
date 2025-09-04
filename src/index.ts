/**
 * Shared Next.js utility functions for ASL19 projects.
 *
 * @packageDocumentation
 */

export { default as getNextJsHeaders } from "./getNextJsHeaders.js";
export { default as replaceCurrentRouteWithShallowRoute } from "./replaceCurrentRouteWithShallowRoute.js";
export { default as useFocusH1OnRouteChangeComplete } from "./useFocusH1OnRouteChangeComplete.js";
export { default as useHrefIsActive } from "./useHrefIsActive.js";
export { default as useIndexPageLoadingAndQueryLogic } from "./useIndexPageLoadingAndQueryLogic.js";
export type {
  IndexPageGetPreviewsAndHasNextPage,
  IndexPageLoadingState,
  IndexPageQueryInfo,
} from "./useIndexPageLoadingAndQueryLogic.js";
