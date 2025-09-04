import { focusElement } from "@asl-19/js-dom-utils";
import { useRouter } from "next/router.js";
import { useEffect } from "react";

type RouterEventHandler = (
  url: string,
  { shallow }: { shallow: boolean },
) => void;

/**
 * Focus h1#main-heading on Next.js routeChangeComplete event.
 *
 * @public
 */
const useFocusH1OnRouteChangeComplete = () => {
  const router = useRouter();

  useEffect(() => {
    const onRouteChangeComplete: RouterEventHandler = (url, { shallow }) => {
      if (!shallow) {
        const h1Elements = document.querySelectorAll("h1");

        if (h1Elements.length === 0) {
          console.warn(
            "[useFocusH1OnRouteChangeComplete] Page has no <h1> element! Skipping focus.",
          );
        } else {
          if (h1Elements.length > 1) {
            console.warn(
              "[useFocusH1OnRouteChangeComplete] Page unexpectedly contains more than one <h1> element! Focussing first one.",
            );
          }
          focusElement(h1Elements[0], { preventScroll: true });
        }
      }
    };

    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, [router]);
};

export default useFocusH1OnRouteChangeComplete;
