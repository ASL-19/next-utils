# @asl-19/next-utils changelog

## [0.6.0](https://github.com/ASL-19/next-utils/pulls?q=is%3Apr+is%3Aclosed+milestone%3A0.5.0) [2023-10-01]

### Changes

- Added `replaceCurrentRouteWithShallowRoute` and `useHrefIsActive`; removed obsolete `AslLink` and `loadEnvFileIntoProcessEnv`

## [0.5.0](https://github.com/ASL-19/next-utils/pulls?q=is%3Apr+is%3Aclosed+milestone%3A0.5.0) [2022-04-21]

### Changes

- Upgraded dependencies, required React 18 [**Breaking**] [[#12](https://github.com/ASL-19/next-utils/pull/12)]

## [0.4.0](https://github.com/ASL-19/next-utils/pulls?q=is%3Apr+is%3Aclosed+milestone%3A0.4.0) [2021-12-23]

### Changes

- Added Next.js 12 support [[#10](https://github.com/ASL-19/next-utils/pull/10)]

## [0.3.0](https://github.com/ASL-19/next-utils/pulls?q=is%3Apr+is%3Aclosed+milestone%3A0.3.0) [2021-10-20]

### Removals

- Removed `cspHeaderPreset` and `defaultGlobalHeaders` [**Breaking**] [[#6](https://github.com/ASL-19/next-utils/pull/6)]

  In hindsight these weren’t worth centralizing:

  - `cspHeaderPreset` was problematic because the default `NONE` directives were invalid if the consuming project added other directives.

  - `defaultGlobalHeaders` obfuscated important header information that developers (including on other teams) may need to reference.

### Changes

- Simplified `getNextJsHeaders` arguments [**Breaking**] [[#8](https://github.com/ASL-19/next-utils/pull/8)]

  Replaced object argument with a single headers key with single positional argument.

## [0.2.0](https://github.com/ASL-19/next-utils/pulls?q=is%3Apr+is%3Aclosed+milestone%3A0.2.0) [2021-10-04]

### Additions

- Added [`cspHeaderPreset`][0.2.0-cspHeaderPreset], [`defaultGlobalHeaders`][0.2.0-defaultGlobalHeaders], and [`getNextJsHeaders`][0.2.0-getNextJsHeaders] [[#4](https://github.com/ASL-19/next-utils/pull/4)]

[0.2.0-cspHeaderPreset]: https://github.com/ASL-19/next-utils/blob/develop/docs/next-utils.cspheaderpreset.md
[0.2.0-defaultGlobalHeaders]: https://github.com/ASL-19/next-utils/blob/develop/docs/next-utils.defaultglobalheaders.md
[0.2.0-getNextJsHeaders]: https://github.com/ASL-19/next-utils/blob/develop/docs/next-utils.getnextjsheaders.md

### Changes

- Upgraded dependencies [[#2](https://github.com/ASL-19/next-utils/pull/2)]

## 0.1.0 [2021-07-09]

First release
