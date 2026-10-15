[**@asl-19/next-utils**](../README.md)

***

[@asl-19/next-utils](../README.md) / IndexPageQueryInfo

# Type Alias: IndexPageQueryInfo\<PageNormalizedQuery, LocaleCode\>

> **IndexPageQueryInfo**\<`PageNormalizedQuery`, `LocaleCode`\> = `object`

Index page query info.

This is used to update indexPageLoadingState, and is passed to
getPreviewsAndHasNextPage.

## Type Parameters

### PageNormalizedQuery

`PageNormalizedQuery`

### LocaleCode

`LocaleCode` *extends* `string` = `string`

## Properties

### isLoadMoreQuery

> **isLoadMoreQuery**: `boolean`

Is query loading more items (`loadingMore`), or loading new items
(`loadingNew`)?

***

### localeCode

> **localeCode**: `LocaleCode`

***

### normalizedQuery

> **normalizedQuery**: `PageNormalizedQuery`

***

### normalizedQueryHasChanged?

> `optional` **normalizedQueryHasChanged?**: `boolean`

Has the normalized query changed since initial render?
