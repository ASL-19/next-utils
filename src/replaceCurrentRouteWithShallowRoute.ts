import { NextRouter } from "next/router";
/**
 * [Replace] the current route with a [shallow route].
 *
 * @remarks
 * This is useful to set the replace this initial route of shallow-routed pages
 * (e.g. index pages with custom shallow routing logic) with a shallow route.
 *
 * Without this change if the user uses the back button/gesture to return to the
 * initial route of a page driven by shallow routing Next.js will do an
 * unnecessary full page load (running getServerSideProps and displaying the
 * global loading indicator rather than the page-specific loading indicator).
 * This isn’t inherently a problem but it’s a confusing user experience.
 *
 * Ideally Next.js add  more sophisticated routing capabilities to remove the
 * need for workarounds like this.
 *
 * [replace]: https://nextjs.org/docs/api-reference/next/router#routerreplace
 * [shallow route]: https://nextjs.org/docs/routing/shallow-routing
 *
 * @public
 */

const replaceCurrentRouteWithShallowRoute = ({
  router,
}: {
  router: NextRouter;
}) =>
  router.replace(router.asPath, undefined, {
    scroll: false,
    shallow: true,
  });

export default replaceCurrentRouteWithShallowRoute;
