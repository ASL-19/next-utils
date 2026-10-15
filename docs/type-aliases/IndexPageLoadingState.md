[**@asl-19/next-utils**](../README.md)

***

[@asl-19/next-utils](../README.md) / IndexPageLoadingState

# Type Alias: IndexPageLoadingState

> **IndexPageLoadingState** = \{ `type`: `"error"`; \} \| \{ `type`: `"hasMore"`; \} \| \{ `type`: `"hasNoMore"`; \} \| \{ `type`: `"hasNone"`; \} \| \{ `type`: `"loadingMore"`; \} \| \{ `type`: `"loadingNew"`; \}

Index page loading state. One of these possible types:

- `error`: Encountered an error/timeout while loading new items
- `loadingNew`: Loading a new set of items (because filter/ordering changed)
- `loadingMore`: Loading more of the current set of items
- `hasMore`: Has more items to load (should show “Load more” link)
- `hasNoMore`: Has no more items to load (should NOT show load more link)
- `hasNone`: Has no items (should show “No items” message)
