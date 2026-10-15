[**@asl-19/next-utils**](../README.md)

***

[@asl-19/next-utils](../README.md) / IndexPageGetPreviewsAndHasNextPage

# Type Alias: IndexPageGetPreviewsAndHasNextPage\<PageNormalizedQuery, Preview, LocaleCode\>

> **IndexPageGetPreviewsAndHasNextPage**\<`PageNormalizedQuery`, `Preview`, `LocaleCode`\> = (`queryInfo`) => `Promise`\<\{ `hasNextPage`: `boolean`; `previews`: `Preview`[]; \}\>

Index page getPreviewsAndHasNextPage function.

## Type Parameters

### PageNormalizedQuery

`PageNormalizedQuery`

### Preview

`Preview`

### LocaleCode

`LocaleCode` *extends* `string` = `string`

## Parameters

### queryInfo

[`IndexPageQueryInfo`](IndexPageQueryInfo.md)\<`PageNormalizedQuery`, `LocaleCode`\>

## Returns

`Promise`\<\{ `hasNextPage`: `boolean`; `previews`: `Preview`[]; \}\>
