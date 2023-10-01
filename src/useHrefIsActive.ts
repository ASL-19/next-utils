import { useRouter } from "next/router";

/**
 * Determine if the passed `href` is active based on its pathname and a
 * whitelist of query string keys.
 *
 * Returns true if `href`’s pathname (the part before the query string) matches
 * the router’s pathname (parsed from `router.asPath`) and the value of each of
 * the `activeUrlComparisonQueryKeys` matches the values in `router.query`.
 *
 * @public
 */
const useHrefIsActive = ({
  activeUrlComparisonQueryKeys,
  href,
  webPublicUrl,
}: {
  activeUrlComparisonQueryKeys: Array<string>;
  href: string;
  webPublicUrl: string;
}) => {
  const router = useRouter();

  const parsedHref = new URL(href, webPublicUrl);

  // We can’t use router.pathname since it’s the filesystem path, not the URL
  // pathname
  const currentPathname = new URL(router.asPath, webPublicUrl).pathname;

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
};

export default useHrefIsActive;
