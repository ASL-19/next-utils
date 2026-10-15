[**@asl-19/next-utils**](../README.md)

***

[@asl-19/next-utils](../README.md) / useIndexPageLoadingAndQueryLogic

# Function: useIndexPageLoadingAndQueryLogic()

> **useIndexPageLoadingAndQueryLogic**\<`PageNormalizedQuery`, `Preview`, `LocaleCode`\>(`options`): `object`

Fetch and display new items when the router query changes.

## Type Parameters

### PageNormalizedQuery

`PageNormalizedQuery` *extends* `object`

### Preview

`Preview` *extends* `object`

### LocaleCode

`LocaleCode` *extends* `string` = `string`

## Parameters

### options

Hook options

#### announceLoadingNewItemsComplete

(`__namedParameters`) => `void`

Function that announces (to
screen readers) that loading finished, and how many items were added

#### announceLoadingNewItemsStarted

() => `void`

Function that announces (to
screen readers) that loading started

#### getPageNormalizedQuery

(`query`) => `PageNormalizedQuery`

Function that converts a
Next-provided query to a normalized query

#### getPreviewElementId

(`preview`) => `string`

Function that returns the HTML ID of a
given preview item. This is used to focus the first new item after more items
are loaded

#### getPreviewsAndHasNextPage

[`IndexPageGetPreviewsAndHasNextPage`](../type-aliases/IndexPageGetPreviewsAndHasNextPage.md)\<`PageNormalizedQuery`, `Preview`, `LocaleCode`\>

Function that fetches the previews
for a query, and returns them with whether the response indicated there’s
another page of results (e.g. `!!response.items?.pageInfo.hasNextPage`)

#### initialHasNextPage

`boolean`

Did the initial response indicate that
there’s another page of results?

#### initialPreviews

`Preview`[]

Initial preview items

#### localeCode

`LocaleCode`

Current locale code, passed to
`getPreviewsAndHasNextPage` in `queryInfo`

## Returns

`object`

### indexPageLoadingState

> **indexPageLoadingState**: [`IndexPageLoadingState`](../type-aliases/IndexPageLoadingState.md)

### previews

> **previews**: `Preview`[]

### previewsQueryInfo

> **previewsQueryInfo**: [`IndexPageQueryInfo`](../type-aliases/IndexPageQueryInfo.md)\<`PageNormalizedQuery`, `LocaleCode`\>

### queryInfo

> **queryInfo**: [`IndexPageQueryInfo`](../type-aliases/IndexPageQueryInfo.md)\<`PageNormalizedQuery`, `LocaleCode`\>

## Remarks

Takes three type parameters, which are inferred from the options, so they
don’t need to be passed explicitly:

1. `PageNormalizedQuery`: The page’s normalized query type (inferred from
   `getPageNormalizedQuery`). Its `count` property is the number of items to
   display, so a query that only increases `count` loads more items, and any
   other change loads a new set of items.
2. `Preview`: The page’s preview item type (inferred from `initialPreviews`)
3. `LocaleCode`: The project’s locale code type (inferred from `localeCode`)

TypeScript can’t infer some type parameters and take others explicitly, so
if you pass the first two you also need to pass `LocaleCode`; otherwise it
defaults to `string`.

The callbacks don’t need to be memoized: the hook always calls the latest
ones, and only fetches when the normalized query changes.

Responses to outdated requests (e.g. if the user changed a filter while the
previous request was loading, or left the page) are ignored.

## Example

```tsx
type BlogPageNormalizedQuery = { count: number; topic: string };

const getBlogPageNormalizedQuery = (
  query: NextRouter["query"],
): BlogPageNormalizedQuery => ({
  count: Number(query.count) || postsPerPage,
  topic: typeof query.topic === "string" ? query.topic : "",
});

// Defined outside the component, though inline functions work too
const getBlogPagePreviewsAndHasNextPage: IndexPageGetPreviewsAndHasNextPage<
  BlogPageNormalizedQuery,
  PostPreview,
  LocaleCode
> = async ({ localeCode, normalizedQuery }) => {
  const response = await graphQlSdk.getPosts({
    first: normalizedQuery.count,
    localeCode,
    topic: normalizedQuery.topic,
  });

  return {
    hasNextPage: !!response.posts?.pageInfo.hasNextPage,
    previews: response.posts?.edges.map((edge) => edge.node) ?? [],
  };
};

const BlogPage = ({ initialHasNextPage, initialPreviews }: BlogPageProps) => {
  const { localeCode } = useLocaleInfo();

  const { indexPageLoadingState, previews, previewsQueryInfo } =
    useIndexPageLoadingAndQueryLogic({
      announceLoadingNewItemsComplete: ({ count }) => {
        announce({ text: `Loaded ${count} items` });
      },
      announceLoadingNewItemsStarted: () => {
        announce({ text: "Loading new items" });
      },
      getPageNormalizedQuery: getBlogPageNormalizedQuery,
      getPreviewElementId: (preview) => `PostPreview-${preview.id}`,
      getPreviewsAndHasNextPage: getBlogPagePreviewsAndHasNextPage,
      initialHasNextPage,
      initialPreviews,
      localeCode,
    });

  // Render previews (each with the ID from getPreviewElementId), the current
  // topic from previewsQueryInfo.normalizedQuery.topic, and a loading
  // indicator, “Load more” link (to the same URL with a higher count), or
  // error/empty message based on indexPageLoadingState.type
};
```
