/**
 * Shared Next.js utility functions for ASL19 projects.
 *
 * @packageDocumentation
 */

import { FC } from 'react';
import { LinkProps } from 'next/link';

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
export declare const AslLink: FC<LinkProps>;

/**
 * {@link https://github.com/frux/csp/tree/master/packages/csp-header | csp-headers}
 * preset.
 *
 * @remarks Includes basic rules and Google Analytics/Google Tag Manager exceptions.
 */
export declare const cspHeaderPreset: {
    "base-uri": string[];
    "connect-src": string[];
    "default-src": string[];
    "img-src": string[];
    "frame-ancestors": string[];
    "frame-src": string[];
    "manifest-src": string[];
    "object-src": string[];
    "script-src": string[];
    "style-src": string[];
};

/**
 * Default global header values by name.
 *
 * @remarks
 * Should be used with {@link getNextJsHeaders}.
 */
export declare const defaultGlobalHeaders: {
    "Cache-Control": string;
    "Cross-Origin-Embedder-Policy": string;
    "Cross-Origin-Opener-Policy": string;
    "Cross-Origin-Resource-Policy": string;
    "Feature-Policy": string;
    "Referrer-Policy": string;
    "Strict-Transport-Security": string;
    "X-Content-Type-Options": string;
    "X-Frame-Options": string;
    "X-XSS-Protection": string;
};

/**
 * Get Next.js headers array from object containing header values by name.
 */
export declare const getNextJsHeaders: ({ headers, }: {
    headers: {
        [headerName: string]: string;
    };
}) => {
    key: string;
    value: string;
}[];

/**
 * Load .env.* into process.env using Next.js’ loadEnvConfig.
 *
 * @remarks
 * For dev/build/start loads .env.local; for tests loads .env.test.
 *
 * See https://nextjs.org/docs/basic-features/environment-variables
 */
export declare const loadEnvFileIntoProcessEnv: () => void;

export { }
