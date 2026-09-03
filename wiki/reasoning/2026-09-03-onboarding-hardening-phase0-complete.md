---
date: 2026-09-03
source: agent
topics: onboarding-flow, gate1-signing, trust-and-failure-boundaries, testing-strategy
decisions:
status: current
supersedes: 2026-09-03-onboarding-hardening-phase0-corrections
tags: interdependency
summary: Phase 0 oracle corrections complete — all eight owner-itemized fixes applied to the AT-HD-* oracle and its two dependent frozen files; production untouched; owner re-sign is the only remaining blocker before Phase 1.
---

# Onboarding hardening Phase 0 — corrections complete, owner re-sign pending

All eight correction items from the owner's 2026-09-03 work order (responding
to `2026-09-03-onboarding-hardening-oracle-review.md`) are applied. See
`2026-09-03-onboarding-hardening-phase0-corrections.md` for the plan and the
source-inspection findings that shaped it; this trace records the completed
state and verification evidence.

## What changed

- `tests/onboarding-hardening.test.js`: AT-HD-1 (tightened matcher, direct
  `signApproval` import), AT-HD-2 (actionable EEXIST message + proven retry
  after operator cleanup), AT-HD-3 (harness-visible `CLAUDE.md` fixture +
  before/after mutation-boundary proof), AT-HD-4 (scope-correct native/
  instruction-only paths, `rig-debugging` selection, `applied.projections`
  assertion), AT-HD-5 (all three README editions), AT-HD-6 (matches the real
  `"inventory: target must exist"` error), AT-HD-8 (positive-only assertions,
  no negative phrasing regex).
- `tests/onboarding-invariants.test.js`: I-A-1, I-A-3, I-B-1, I-B-2 rewritten
  from source-shape/identifier-name parsing to adversarial behavioral proofs
  (no-mutation-on-tamper, no-mutation-on-drift, a second native/
  instruction-only host pair, and an end-to-end `check()` propagation proof
  through a scan-root symlink that isolates `inventoryHarness`'s own
  `isSymbolicLink()` handling from the shared `walkFiles` used elsewhere in
  `onboarding-check.js`). I-C-2 now rejects any quoted version literal
  unconditionally.
- `tests/helpers/path-b.js`: `installRuntime` derives `releaseTag` from
  `package.json`.
- `tests/advanced-oracle.test.js`: AT-DIST-1 asserts a semver shape instead of
  pinning `'5.0.0'`.
- `wiki/gate2/onboarding-hardening-spec.md` / `-invariants.md` (working,
  not frozen): F3's bounded-harness scope note, F4's scope-specific naming
  rule, F6's throw-only Rejected note, F2's required recovery message, and the
  invariant suite's shift to adversarial proofs, documented.
- `Home.md`, `topics/the-two-gates.md`, `topics/what-rig-is.md`,
  `index/acceptance-cases.md`: stale 83-case/14-file/99-string claims
  corrected to the actual 95-case/16-file/100-string counts (verified via
  `grep -oE 'AT-[A-Z]+-?[0-9]+' wiki/gate1/acceptance.md | sort -u | wc -l`).
- Filed `wiki/gate1/unfreeze-requests/2026-09-03-onboarding-hardening-oracle-corrections.md`
  as the authorization record.

## Verification evidence

- `node scripts/check-advanced-spec.js` reports `changed oracle file:
  tests/advanced-oracle.test.js` (the digest check runs file-by-file and stops
  at the first mismatch found; all four touched files' bytes moved) — proof
  the corrected bytes are real and unsigned, exactly the expected Phase 0 end
  state.
- `node --test tests/onboarding-hardening.test.js`: 8/8 red, each verified by
  hand to fail for the *intended* pre-implementation reason (missing
  exception, wrong path, missing export — not a setup bug in the new test
  body).
- `node --test tests/onboarding-invariants.test.js`: 9 red / 4 green
  (I-C-4, I-D-2, I-D-3, I-D-4), matching the pattern the invariants doc
  predicts for a signed-but-not-yet-implemented oracle.
- `node --test tests/path-b-onboarding.test.js tests/path-b-hardening.test.js
  tests/path-b-install.test.js tests/path-b-weight.test.js
  tests/path-b-mcp.test.js`: 90/91 pass; the one failure is
  `tests/path-b-hardening.test.js`'s own "oracle is verified green" gate
  check, which fails by design while the oracle is intentionally unsigned.
- `node scripts/check-rule-copies.js`, `node scripts/check-versions.js`,
  `node scripts/build-wiki-index.js` (idempotent after one run),
  `node scripts/wiki-maintenance.js lint`, `git diff --check`: all clean.
- No file under `rig/lib/`, `rig-mcp/`, or `rig/mcp-runtime/` was touched.

## What's next (blocked on the owner)

`node scripts/approve-gate1.js` must be run on a machine holding the gate1
signing key — this sandbox has no SSH signing identity
(`ssh-add -l` → "The agent has no identities"; no Secretive agent socket
present). The ceremony will refuse on its first run and print the required
`--confirm-digest-delta <digest>`; re-running with that flag confirms and
signs. Only after that re-sign may Phase 1 (production implementation of the
eight hardening findings, tasks A-H) begin, per the owner's routing.
