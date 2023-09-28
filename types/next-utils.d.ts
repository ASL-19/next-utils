/**
 * Shared Next.js utility functions for ASL19 projects.
 *
 * @packageDocumentation
 */

import { FC } from 'react';
import { LinkProps } from 'next/link';
import { NextRouter } from 'next/router';
import { ReactNode } from 'react';

/**
 * Same as {@link https://nextjs.org/docs/api-reference/next/link|next/link},
 * but with passHref prop pre-set.
 *
 * @remarks
 * The passHref prop needs to be set for any Next.js Link wrapping an element
 * with the Emotion css prop (because it turns the styled element into custom
 * component). This is an unintuitive restriction that’s likely to cause
 * unexpected mistakes/regressions, so it’s safest to always use AslLink over
 * Link.
 */
export declare const AslLink: FC<LinkProps & {
    children: ReactNode;
}>;

/**
 * Get Next.js headers array from object containing header values by name.
 */
export declare const getNextJsHeaders: (headers: {
    [headerName: string]: string;
}) => {
    key: string;
    value: string;
}[];

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
export declare const replaceCurrentRouteWithShallowRoute: ({ router, }: {
    router: NextRouter;
}) => Promise<boolean>;

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
export declare const useHrefIsActive: ({ activeUrlComparisonQueryKeys, href, webPublicUrl, }: {
    activeUrlComparisonQueryKeys: Array<string>;
    href: string;
    webPublicUrl: string;
}) => boolean;

export { }
