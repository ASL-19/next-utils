[**@asl-19/next-utils**](../README.md)

***

[@asl-19/next-utils](../README.md) / useHrefIsActive

# Function: useHrefIsActive()

> **useHrefIsActive**(`options`): `boolean`

Determine if the passed `href` (or any of the passed `href`s) is active
based on its pathname and an allowlist of query string keys.

Returns true if an `href`’s pathname (the part before the query string)
matches the router’s pathname (parsed from `router.asPath`) and the value of
each of the `activeUrlComparisonQueryKeys` matches the values in
`router.query`.

## Parameters

### options

Hook options

#### activeUrlComparisonQueryKeys

`string`[]

Query string keys whose values
must also match for an `href` to be active

#### href

`string` \| `string`[]

The `href`, or an array of `href`s (e.g. a link’s
`href` and other URLs it should be shown as active on)

#### webPublicUrl?

`string`

**Deprecated**

Ignored, since `href`s are compared by pathname and query
string. Will be removed in the next major version

## Returns

`boolean`
