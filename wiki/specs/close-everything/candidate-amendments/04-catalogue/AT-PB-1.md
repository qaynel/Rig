# Subplan 04 candidate amendment — active catalogue pin

**Status: CANDIDATE, unsigned.** Prepared 2026-10-14 under the close-everything
plan ([catalogue services](../../04-catalogue-services.md)). The pinned files
under `wiki/gate1/` and tests in
`wiki/gate1/testing-infrastructure.manifest` were not edited. The owner applies
this change in the single batched re-sign; agents never sign.

## AT-PB-1 — pin the active 115-service corpus

- File: `tests/path-b-catalog.test.js` (pinned), case
  `AT-PB-1 the governed 115-service catalogue remains byte-identical`.
- Why: catalogue authority is now `rig/corpus/catalogue.json` and
  `rig/corpus/services/`. The frozen case still hashes the compatibility copy
  in `rig/catalog.json` and `rig/catalog/services/`, so it does not pin the
  active corpus. Keep the compatibility copy unchanged and make the frozen
  oracle identify the current canonical bytes.
- Applicable diff: the current consolidated
  [`binding-review-owner.patch`](../binding-review-owner.patch) supersedes the
  older `owner-amendments.patch` for this case and carries it with the current
  release, host, lint-grade, nonce, and namespace corrections.

- Candidate pin calculation: SHA-256 over each sorted repository-relative path,
  NUL, file bytes, NUL — 1,042 files — gives
  `759b7cc73baa241fb47a79cbd270244bc9d4229272ccb4973261d324bf2456f5`
  on the catalogue bytes verified 2026-10-20. Earlier values, including
  `3e5bcd14a93904d6d808d74c6122799095d840f2e37ca50d900e9bf4418c19dd`, are
  stale. Recompute before signing if any file under `rig/corpus/services/` or
  `rig/corpus/catalogue.json` changes; the patch's assertion is the check.
- Frozen AT-PB-1 remains untouched until the owner applies this amendment.
