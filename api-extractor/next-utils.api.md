## API Report File for "@asl-19/next-utils"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { NextRouter } from 'next/router';

// @public
export const getNextJsHeaders: (headers: {
    [headerName: string]: string;
}) => {
    key: string;
    value: string;
}[];

// @public
export const replaceCurrentRouteWithShallowRoute: ({ router, }: {
    router: NextRouter;
}) => Promise<boolean>;

// @public
export const useHrefIsActive: ({ activeUrlComparisonQueryKeys, href, webPublicUrl, }: {
    activeUrlComparisonQueryKeys: Array<string>;
    href: string;
    webPublicUrl: string;
}) => boolean;

```
