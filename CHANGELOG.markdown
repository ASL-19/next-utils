# @asl-19/next-utils changelog

## Unreleased

- Add `useFocusH1OnRouteChangeComplete`, which focuses the page’s `<h1>` (or an element matching `selector`) after non-shallow route changes, unless `shouldSkipFocus` returns true
- Add `useIndexPageLoadingAndQueryLogic`, which fetches and displays an index page’s items when its query changes, ignoring outdated responses, and focusing and announcing the first item a “load more” response adds
- Add `@asl-19/js-dom-utils` dependency
- `useHrefIsActive`: Accept an array of `href`s, returning true if any of them is active (e.g. to show a link as active on related pages)
- `useHrefIsActive`: Deprecate `webPublicUrl`, which is now optional and ignored, since `href`s are only compared by pathname and query string
- Widen `next` peer dependency range to `^15.4.2 || ^16.0.0`, and `react` and `react-dom` to `^19.0.0`
- Add parameter descriptions to `useHrefIsActive` type declarations

Development tooling:

- Replace API Extractor and API Documenter with TypeDoc
- Add Vitest tests (happy-dom, React Testing Library) for each function and hook, replacing the unused Jest setup
- Remove package-changed and npm-check-updates, and add `outdated` scripts
- Add ESLint, publint, Are the Types Wrong? (`attw`) and a docs freshness check to `lint-test`
- Manage Node.js 24 and pinact with mise
- Add npm supply-chain gates (`.npmrc`, `devEngines`, `allowScripts`)
- Update TypeScript to 6.0, ESLint to 10, @asl-19/eslint-config to 1.0 and Prettier to 3.9, and compile with `module: "nodenext"`
- Pin GitHub Actions to commit SHAs, limit the workflow token to read-only, and run CI on pull requests
- Add agent instructions (`AGENTS.md`) and Claude Code permission settings

## [1.0.0](https://github.com/ASL-19/next-utils/pulls?q=is%3Apr+is%3Aclosed+milestone%3A1.0.0) [2025-08-15]

- Migrate to ESM [[#14](https://github.com/ASL-19/next-utils/pull/14)]
- Increase `next`, `react`, and `react-dom` `peerDependencies` versions [[#15](https://github.com/ASL-19/next-utils/pull/15)]

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
