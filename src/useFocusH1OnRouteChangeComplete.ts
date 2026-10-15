import { focusElement } from "@asl-19/js-dom-utils";
import { useRouter } from "next/router.js";
import { useEffect, useRef } from "react";

type RouterEventHandler = (
  url: string,
  { shallow }: { shallow: boolean },
) => void;

/**
 * Focus the page’s `<h1>` on the Next.js `routeChangeComplete` event, so
 * screen reader and keyboard users start from the new page’s heading.
 *
 * @remarks
 * Shallow route changes (e.g. filtering an index page) are ignored, since the
 * user is still on the same page.
 *
 * @param options - Hook options
 * @param options.selector - Selector of the heading to focus. Defaults to
 * `"h1"`. If more than one element matches, the first is focused
 * @param options.shouldSkipFocus - Function that returns true if the heading
 * shouldn’t be focused after a route change, e.g. if only a query string value
 * changed and focus should stay on the control that changed it
 *
 * @example
 * Call it once in `_app.tsx`:
 *
 * ```tsx
 * const App = ({ Component, pageProps }: AppProps) => {
 *   useFocusH1OnRouteChangeComplete();
 *
 *   return <Component {...pageProps} />;
 * };
 * ```
 *
 * @example
 * Focus a specific heading, but not when only the `platform` query string
 * value changed (so focus stays on the platform selector):
 *
 * ```tsx
 * useFocusH1OnRouteChangeComplete({
 *   selector: "h1#main-heading",
 *   shouldSkipFocus: ({ previousUrl, url }) => {
 *     const previous = new URL(previousUrl, "https://example.com");
 *     const next = new URL(url, "https://example.com");
 *
 *     previous.searchParams.delete("platform");
 *     next.searchParams.delete("platform");
 *
 *     return previous.href === next.href;
 *   },
 * });
 * ```
 *
 * @public
 */
const useFocusH1OnRouteChangeComplete = ({
  selector = "h1",
  shouldSkipFocus,
}: {
  selector?: string;
  shouldSkipFocus?: (urls: { previousUrl: string; url: string }) => boolean;
} = {}) => {
  const router = useRouter();

  const previousUrlRef = useRef(router.asPath);

  // Store shouldSkipFocus in a ref so passing an inline function doesn’t
  // resubscribe to router events on every render
  const shouldSkipFocusRef = useRef(shouldSkipFocus);

  useEffect(() => {
    shouldSkipFocusRef.current = shouldSkipFocus;
  }, [shouldSkipFocus]);

  useEffect(() => {
    const onRouteChangeComplete: RouterEventHandler = (url, { shallow }) => {
      const previousUrl = previousUrlRef.current;

      previousUrlRef.current = url;

      if (shallow) {
        return;
      }

      if (shouldSkipFocusRef.current?.({ previousUrl, url })) {
        return;
      }

      const headingElements = document.querySelectorAll<HTMLElement>(selector);

      if (headingElements.length === 0) {
        console.warn(
          `[useFocusH1OnRouteChangeComplete] Page has no element matching “${selector}”! Skipping focus.`,
        );
        return;
      }

      if (headingElements.length > 1) {
        console.warn(
          `[useFocusH1OnRouteChangeComplete] Page unexpectedly contains more than one element matching “${selector}”! Focussing first one.`,
        );
      }

      focusElement(headingElements[0], { preventScroll: true });
    };

    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, [router.events, selector]);
};

export default useFocusH1OnRouteChangeComplete;
