import { useRouter } from "next/router.js";

// Base used to parse root-relative hrefs with the URL constructor. Only
// pathname and searchParams are ever read, so the base’s origin is irrelevant
// to the result
const baseUrl = "https://example.com";

/**
 * Determine if the passed `href` (or any of the passed `href`s) is active
 * based on its pathname and an allowlist of query string keys.
 *
 * Returns true if an `href`’s pathname (the part before the query string)
 * matches the router’s pathname (parsed from `router.asPath`) and the value of
 * each of the `activeUrlComparisonQueryKeys` matches the values in
 * `router.query`.
 *
 * @param options - Hook options
 * @param options.activeUrlComparisonQueryKeys - Query string keys whose values
 * must also match for an `href` to be active
 * @param options.href - The `href`, or an array of `href`s (e.g. a link’s
 * `href` and other URLs it should be shown as active on)
 *
 * @public
 */
const useHrefIsActive = ({
  activeUrlComparisonQueryKeys,
  href,
}: {
  activeUrlComparisonQueryKeys: Array<string>;
  href: Array<string> | string;
  /**
   * @deprecated Ignored, since `href`s are compared by pathname and query
   * string. Will be removed in the next major version
   */
  webPublicUrl?: string;
}) => {
  const router = useRouter();

  // We can’t use router.pathname since it’s the filesystem path, not the URL
  // pathname
  const currentPathname = new URL(router.asPath, baseUrl).pathname;

  return (Array.isArray(href) ? href : [href]).some((href) => {
    const parsedHref = new URL(href, baseUrl);

    return (
      parsedHref.pathname === currentPathname &&
      // Compare the query string values rather than router.asPath because the
      // URL could contain irrelevant parameters like fbclid or utm_source.
      activeUrlComparisonQueryKeys.every(
        (queryKey) =>
          (!router.query[queryKey] && !parsedHref.searchParams.get(queryKey)) ||
          router.query[queryKey] === parsedHref.searchParams.get(queryKey),
      )
    );
  });
};

export default useHrefIsActive;
