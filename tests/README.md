# tests

Run: `npx vitest run` (the project uses yarn only via `npx yarn@1.22.22`; never npm for installs).

## Render mode (default)

`vitest.config.js` sets `VUE_TEST_RENDER=1` by default, so the SSR-equivalence suites
(`pagesSsr`, `landingSsr`, `deadMarkup`, `contractListPages`, `gapFormEvents`, ...) run in the normal
`npx vitest run` / `npm test` — no environment variable is needed.

- In render mode every `.vue` file gets a render function. Templates are compiled with
  `@vue/component-compiler-utils` (vue-template-es2015-compiler / buble). Buble cannot compile
  `?.` / `??` in template expressions, so for such templates the plugin falls back to
  `vue-template-compiler`'s plain `with(this)` render functions (no transpilation; Node runs them directly).
  This is a test-only path; webpack (vue-loader + babel) builds the real bundle.
- `VUE_TEST_RENDER=0 npx vitest run` — script-only mode (no templates compiled; render suites are skipped).
  All fingerprint/script suites also pass in this mode.
- Fixtures: `tests/fixtures/**`. Regenerate only from the pre-refactor source:
  `UPDATE_SSR=1 npx vitest run <file>`, `UPDATE_CSS=...`, `UPDATE_FP=1 ...` (see the header comment of each test).

## Notable suites

- `pageStylesCss.test.js` — split page stylesheets (`assets/page-styles/<sheet>/<Component>.css|scss`): the union of
  compiled rules equals the original rule set; each component's file contains only rules whose element is in its template.
- `gapFormEvents.test.js` — Gap inputs keep `v-model` / `v-model.number` semantics (IME composition guard, number coercion)
  via computed get/set that emit `update-field` / `update-new` / `update-edit`.
- `telegramAutologin.test.js` — Mini App `/telegram/auth` 403 `ACCOUNT_DELETED` / 429 are terminal (message, no retry).
