/**
 * Shared Next.js utility functions for ASL19 projects.
 *
 * @packageDocumentation
 */

import { FC } from 'react';
import { LinkProps } from 'next/link';
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
 * Load .env.* into process.env using Next.js’ loadEnvConfig.
 *
 * @remarks
 * For dev/build/start loads .env.local; for tests loads .env.test.
 *
 * See https://nextjs.org/docs/basic-features/environment-variables
 */
export declare const loadEnvFileIntoProcessEnv: () => void;

export { }
