# Dev CI RED status (Phase 2)

- `package.json` `npm test` already runs `node --test tests/*.test.js`, which
  includes every `tests/advanced-*.test.js` file.
- `.github/workflows/test.yml` invokes `npm test` (full gate). No second
  workflow was added.
- Expected status until Phase 3/4: **RED** — Advanced suite fails because
  catalogue subcommands / `rig/catalog.json` / lib modules are not implemented
  yet. That is the intentional red window; do not weaken tests to go green.
