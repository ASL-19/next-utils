[**@asl-19/next-utils**](../README.md)

***

[@asl-19/next-utils](../README.md) / useFocusH1OnRouteChangeComplete

# Function: useFocusH1OnRouteChangeComplete()

> **useFocusH1OnRouteChangeComplete**(`options?`): `void`

Focus the page’s `<h1>` on the Next.js `routeChangeComplete` event, so
screen reader and keyboard users start from the new page’s heading.

## Parameters

### options?

Hook options

#### selector?

`string` = `"h1"`

Selector of the heading to focus. Defaults to
`"h1"`. If more than one element matches, the first is focused

#### shouldSkipFocus?

(`urls`) => `boolean`

Function that returns true if the heading
shouldn’t be focused after a route change, e.g. if only a query string value
changed and focus should stay on the control that changed it

## Returns

`void`

## Remarks

Shallow route changes (e.g. filtering an index page) are ignored, since the
user is still on the same page.

## Examples

Call it once in `_app.tsx`:

```tsx
const App = ({ Component, pageProps }: AppProps) => {
  useFocusH1OnRouteChangeComplete();

  return <Component {...pageProps} />;
};
```

Focus a specific heading, but not when only the `platform` query string
value changed (so focus stays on the platform selector):

```tsx
useFocusH1OnRouteChangeComplete({
  selector: "h1#main-heading",
  shouldSkipFocus: ({ previousUrl, url }) => {
    const previous = new URL(previousUrl, "https://example.com");
    const next = new URL(url, "https://example.com");

    previous.searchParams.delete("platform");
    next.searchParams.delete("platform");

    return previous.href === next.href;
  },
});
```
