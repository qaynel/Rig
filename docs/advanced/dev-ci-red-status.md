# Dev CI status

- `package.json` `npm test` already runs `node --test tests/*.test.js`, which
  includes every `tests/advanced-*.test.js` file.
- `.github/workflows/test.yml` invokes `npm test` (full gate). No second
  workflow was added.
- Current expected status: **GREEN**. The Advanced suite is part of the normal
  full gate; a red run is a defect or an intentionally reopened delivery item,
  not a standing Phase 2 window.
