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
- Applicable diff: [`owner-amendments.patch`](../owner-amendments.patch) — one
  patch carries all four frozen-case amendments, applies cleanly to this tree
  with `git apply`, and was proved green before signing (see the bundle).

- Candidate pin calculation: SHA-256 over each sorted repository-relative path,
  NUL, file bytes, NUL — 1,036 files — gives
  `3e5bcd14a93904d6d808d74c6122799095d840f2e37ca50d900e9bf4418c19dd`
  on this tree. **Correction, 2026-10-14:** the first recorded value
  (`c28174db…`) predated the T-4.5/T-4.6 service-wording commits and no longer
  matches, which is why the amendment is only valid against the exact bytes it
  is signed with. Recompute before signing if any file under
  `rig/corpus/services/` or `rig/corpus/catalogue.json` changes; the patch's
  own assertion is the check.
- Frozen AT-PB-1 remains untouched until the owner applies this amendment.
