# Changelog

All notable changes to this project will be documented in this file.

## v3.0.2 10/17/2024

- Multiple bug fixes in `<role-combobox>`
- Added the `hide-selected-options` for hiding options from the list that have already been selected.

## v3.0.1 10/01/2024

- Fixed a bug if interactive elements were children of `<role-toolbar>`

## v3.0.0 09/21/2024

- Removed `role-slider`
- Fixed a bug in `<role-combobox>`

## v3.0.0-beta.3

- Fixed a bug in `<role-anchored-region>` that prevented the popover from closing when active changed.

## v3.0.0-beta.1

### Breaking Changes

- BREAKING_CHANGE: Components have moved to `exports/components` directory.
- BREAKING_CHANGE: `<role-tooltip>` now uses `data-role-tooltip=""` for associating with its tooltip.
- BREAKING_CHANGE: `<role-tooltip>` `hoist` property / attribute has been renamed to `strategy="fixed | absolute"`
- BREAKING_CHANGE: `<role-tooltip>` is now a `popover` which means it will be `position: fixed;` by default and placed in the top layer.
- BREAKING_CHANGE: `exports/base-element.js` is no longer exported

### Features

- Feature: `<role-listbox>`: is now form associated and has been properly tested in NVDA / VoiceOver.
- Feature: `<role-listbox>`: Styles have been moved to the host of the element and are keyed off of `[aria-selected]` and `[aria-current]` respectively.
- Feature: `exports/components/*-register.js` now export any additional exports in the component in addition to the default.

### Bug Fixes

- Fix: `<role-option>`: minor internal refactoring and added a number of properties to be closer to a proper `<option>`.
- Fix: `<role-listbox>`: Fixed a bug where if you had a selected option, it would hit a race condition.

### Dependencies

- Dependencies: Upgrade `lit` from `2.8.x` -> `3.x`
- Dependencies: Upgraded the version of `floating-ui` and removed the `composed-offset-parent` polyfill.

## v2.0.2

- Fix an errant `console.log` that was left in debugging 2.0.1

## v2.0.1

- Fix a regression around lazily slotted elements improperly getting assigned `tabindex="0"`

## v2.0.0

- Remove build step. Publish untranspiled files.
- Move to Lit for rendering
- Moved around file locations. `/dist/` is now `/exports/` Switch to default exports.
- Added an exportmap to package.json

## [v1.1.5](https://github.com/KonnorRogers/role-components/compare/v1.1.4...v1.1.5) (2023-04-18)

### Bug Fixes

- dont focus buttons when clicked ([c495144](https://github.com/KonnorRogers/role-components/commit/c495144fc70433ebef08a45cf560ba78fe0b7b07))

## [v1.1.4](https://github.com/paramagicdev/role-components/compare/v1.1.3...v1.1.4) (2022-12-26)

## [v1.1.3](https://github.com/paramagicdev/role-components/compare/v1.1.2...v1.1.3) (2022-12-24)

## [v1.1.2](https://github.com/paramagicdev/role-components/compare/v1.1.1...v1.1.2) (2022-12-24)

## [v1.1.1](https://github.com/paramagicdev/role-components/compare/v1.1.0...v1.1.1) (2022-12-24)

## [v1.1.0](https://github.com/paramagicdev/role-components/compare/v1.0.11...v1.1.0) (2022-12-24)

## [v1.0.11](https://github.com/paramagicdev/role-components/compare/v1.0.10...v1.0.11) (2022-11-25)

## [v1.0.10](https://github.com/paramagicdev/role-components/compare/v1.0.9...v1.0.10) (2022-10-10)

## [v1.0.9](https://github.com/paramagicdev/role-components/compare/v1.0.8...v1.0.9) (2022-10-02)

### Bug Fixes

- use getRootNode() ([fb1394c](https://github.com/paramagicdev/role-components/commit/fb1394c27fe65b2cd8146b47c3a81a98f3af5315))

## [v1.0.8](https://github.com/paramagicdev/role-components/compare/v1.0.7...v1.0.8) (2022-10-02)

### Bug Fixes

- deploy scripts ([0508372](https://github.com/paramagicdev/role-components/commit/0508372bbd5cf6090b778cbf0e36e808132a748f))
- remove noisy console.log ([fc4d13c](https://github.com/paramagicdev/role-components/commit/fc4d13c776004ab0f70e4d1b396e3293066bf98f))

## [1.0.7](https://github.com/paramagicdev/role-components/compare/v1.0.6...v1.0.7) (2022-10-02)

### Bug Fixes

- deploy scripts ([6fe5a42](https://github.com/paramagicdev/role-components/commit/6fe5a42596e85d3b46f4bdd4160b92708c270294))

## [1.0.6](https://github.com/ParamagicDev/role-components/compare/v1.0.5...v1.0.6) (2022-07-20)

## [1.0.5](https://github.com/ParamagicDev/role-components/compare/v1.0.4...v1.0.5) (2022-07-01)

### Bug Fixes

- allow tooltips to be non-contained ([0cb9a69](https://github.com/ParamagicDev/role-components/commit/0cb9a69e5f95d7ac5ade31289b9296af9e641c07))

## [v1.0.4](https://github.com/ParamagicDev/role-components/compare/v1.0.3...v1.0.4) (2022-06-28)

### Bug Fixes

- entrypoint fix...again ([1a4b811](https://github.com/ParamagicDev/role-components/commit/1a4b811188513fbc281fb2dcdbae9f91fb2bb0a5))

## [v1.0.3](https://github.com/ParamagicDev/role-components/compare/v1.0.2...v1.0.3) (2022-06-28)

### Bug Fixes

- entrypoints now point to the right spot ([f823079](https://github.com/ParamagicDev/role-components/commit/f823079e69ddfe8a7ea001027eb6228742c03b87))

## [v1.0.2](https://github.com/ParamagicDev/role-components/compare/v1.0.1...v1.0.2) (2022-06-28)

### Bug Fixes

- Add multiple entrypoints ([61fb3de](https://github.com/ParamagicDev/role-components/commit/61fb3de53375b8c240520be1b5b064bfb1c6c017))

## [v1.0.1](https://github.com/ParamagicDev/role-components/compare/v1.0.0...v1.0.1) (2022-06-27)

### Bug Fixes

- Handle toolbar clicks properly ([e796e5f](https://github.com/ParamagicDev/role-components/commit/e796e5f1fe68eda84637a882eeae485124a2a5bf))

## v1.0.0 (2022-06-27)
