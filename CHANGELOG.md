# Changelog

## [5.0.0](https://github.com/npm/read-package-json-fast/compare/v4.0.0...v5.0.0) (2025-10-23)
### ⚠️ BREAKING CHANGES
* `read-package-json-fast` now supports node `^20.17.0 || >=22.9.0`
### Bug Fixes
* [`8b34e07`](https://github.com/npm/read-package-json-fast/commit/8b34e07cc29cb64e7ba811f6268e21979fde8f67) [#90](https://github.com/npm/read-package-json-fast/pull/90) align to npm 11 node engine range (@owlstronaut)
### Dependencies
* [`eabe2f9`](https://github.com/npm/read-package-json-fast/commit/eabe2f9dc6f369f55f527e77ac6aff3c65e9cebd) [#90](https://github.com/npm/read-package-json-fast/pull/90) `npm-normalize-package-bin@5.0.0`
* [`6604da4`](https://github.com/npm/read-package-json-fast/commit/6604da4d4a3131a5dd989c846d03eec3dd20176d) [#90](https://github.com/npm/read-package-json-fast/pull/90) `json-parse-even-better-errors@5.0.0`
### Chores
* [`3a6af30`](https://github.com/npm/read-package-json-fast/commit/3a6af30cd6161ada57bb61a916b82ba0f10c2504) [#90](https://github.com/npm/read-package-json-fast/pull/90) template-oss-apply (@owlstronaut)
* [`a1db7fe`](https://github.com/npm/read-package-json-fast/commit/a1db7fed35e4d027646616e71391fc9a2f03cc9d) [#83](https://github.com/npm/read-package-json-fast/pull/83) postinstall workflow updates (#83) (@owlstronaut)
* [`eed175d`](https://github.com/npm/read-package-json-fast/commit/eed175d0d20b2a7b82583a925c2318ce936b4e08) [#88](https://github.com/npm/read-package-json-fast/pull/88) bump @npmcli/template-oss from 4.26.0 to 4.27.1 (#88) (@dependabot[bot], @npm-cli-bot)

## [4.0.0](https://github.com/npm/read-package-json-fast/compare/v3.0.2...v4.0.0) (2024-09-24)
### ⚠️ BREAKING CHANGES
* `read-package-json-fast` now supports node `^18.17.0 || >=20.5.0`
### Bug Fixes
* [`a650021`](https://github.com/npm/read-package-json-fast/commit/a650021a95d535305c90ed8ce37c57217cd65de3) [#79](https://github.com/npm/read-package-json-fast/pull/79) align to npm 10 node engine range (@hashtagchris)
### Dependencies
* [`e603259`](https://github.com/npm/read-package-json-fast/commit/e603259df9a05155878a5cf865d7d1a5cab3504d) [#79](https://github.com/npm/read-package-json-fast/pull/79) `npm-normalize-package-bin@4.0.0`
* [`482ad0e`](https://github.com/npm/read-package-json-fast/commit/482ad0eb93685e82408f0e4fdbb9eeb8ac4063e0) [#79](https://github.com/npm/read-package-json-fast/pull/79) `json-parse-even-better-errors@4.0.0`
### Chores
* [`2e7214c`](https://github.com/npm/read-package-json-fast/commit/2e7214ce3f33765e9559dea0afa7e18fe4717bfd) [#79](https://github.com/npm/read-package-json-fast/pull/79) run template-oss-apply (@hashtagchris)
* [`8c7c240`](https://github.com/npm/read-package-json-fast/commit/8c7c240a9642bc2fe0afc1392e7b32c22263e941) [#78](https://github.com/npm/read-package-json-fast/pull/78) enable auto publish (#78) (@reggi)
* [`bc76038`](https://github.com/npm/read-package-json-fast/commit/bc76038b11ce0f5888923ac56b9a94bd9dc2f5b0) [#74](https://github.com/npm/read-package-json-fast/pull/74) bump @npmcli/eslint-config from 4.0.5 to 5.0.0 (@dependabot[bot])
* [`bd2015f`](https://github.com/npm/read-package-json-fast/commit/bd2015f2aa7d93c2a528405796f9543293d10370) [#63](https://github.com/npm/read-package-json-fast/pull/63) bump @npmcli/template-oss to 4.22.0 (@lukekarrys)
* [`0380e43`](https://github.com/npm/read-package-json-fast/commit/0380e4399748287a6af06ec79512de48e1a1615b) [#75](https://github.com/npm/read-package-json-fast/pull/75) postinstall for dependabot template-oss PR (@hashtagchris)
* [`eb9cd4f`](https://github.com/npm/read-package-json-fast/commit/eb9cd4f9c766a116bf353ce5dbe3eda7f5231558) [#75](https://github.com/npm/read-package-json-fast/pull/75) bump @npmcli/template-oss from 4.23.1 to 4.23.3 (@dependabot[bot])

## [3.0.2](https://github.com/npm/read-package-json-fast/compare/v3.0.1...v3.0.2) (2022-12-13)

### Bug Fixes

* [`28e4e58`](https://github.com/npm/read-package-json-fast/commit/28e4e58a848547b360563eae3606d8bdf0ab5719) use fs/promises (@lukekarrys)

## [3.0.1](https://github.com/npm/read-package-json-fast/compare/v3.0.0...v3.0.1) (2022-10-17)

### Dependencies

* [`2866ecb`](https://github.com/npm/read-package-json-fast/commit/2866ecbe35332d5a3bd7f92d3c8c35e070f58cba) [#17](https://github.com/npm/read-package-json-fast/pull/17) bump npm-normalize-package-bin from 2.0.0 to 3.0.0

## [3.0.0](https://github.com/npm/read-package-json-fast/compare/v2.0.3...v3.0.0) (2022-10-10)

### ⚠️ BREAKING CHANGES

* `read-package-json-fast` is now compatible with the following semver range for node: `^14.17.0 || ^16.13.0 || >=18.0.0`
* update node engines to `^12.13.0 || ^14.15.0 || >=16.0.0`

### Features

* [`e05f996`](https://github.com/npm/read-package-json-fast/commit/e05f9962aaf169c3e58f97309612d9fae10504ad) [#9](https://github.com/npm/read-package-json-fast/pull/9) postinstall for dependabot template-oss PR (@lukekarrys)
* [`4ceacc3`](https://github.com/npm/read-package-json-fast/commit/4ceacc3f5e683782122b13dc576f93f4aa55ca9c) add template-oss (@lukekarrys)

### Bug Fixes

* [`307fc2c`](https://github.com/npm/read-package-json-fast/commit/307fc2c585fdc0599aecd2d7802de4ebed56370c) linting (@lukekarrys)

### Dependencies

* [`47d3e72`](https://github.com/npm/read-package-json-fast/commit/47d3e72e1340e0fb796e225daa2c0377fc3df49e) [#14](https://github.com/npm/read-package-json-fast/pull/14) `json-parse-even-better-errors@3.0.0`
* [`a6e8261`](https://github.com/npm/read-package-json-fast/commit/a6e8261e378e189f0efbea19d362e168254ef881) [#7](https://github.com/npm/read-package-json-fast/pull/7) `npm-normalize-package-bin@2.0.0`
