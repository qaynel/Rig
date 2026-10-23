---
date: 2026-10-15
source: agent
topics: the-overhaul, release-readiness
decisions:
status: current
summary: The full gate is green on the closeout tree — 1054 pass, 0 fail, plus the secret, pi-extension and rig-mcp suites — against the owner's re-signed oracle, so T-10.6 is met and no further signing session is needed.
---
Done: ran `npm test` to completion four times, fixing one defect per run until it
exited 0. Final run: secret hygiene 15/15, main suite 1054 pass / 0 fail,
pi-extension 15/15, rig-mcp 6/6; `check-rule-copies`, `check-versions`,
`check-coherence`, `check-advanced-spec`, `project-repo --check` and
`git diff --check` all clean.

The two reds carried in the earlier notes (AT-SHAPE-6 and AT-PB-3) are gone
because the owner had already applied the amendment bundle to
`tests/advanced-oracle.test.js` and `tests/path-b-catalog.test.js` and re-signed:
`check-advanced-spec` verifies 16 files and 95 cases against principal
`gate1-owner`, and the manifest and signature in the tree are the amended ones.
The batched signing session is therefore behind us, not ahead — the earlier
reading that the signature covered un-amended bytes was taken before those bytes
landed.

Three defects the gate found, all in checks rather than in product code:

- `check-versions` failed ticket traceability: the RIG-149 and RIG-153 acceptance
  evidence still named the test title the router rename replaced. The three wiki
  references now name the live title. See
  [[2026-10-15-router-single-name]].
- The removed `rig` alias left orphaned projection output at
  `.claude/skills/rig/` and `.agents/skills/rig/`. `project-repo.js --check`
  compares only the files the projector emits, so an orphan is invisible to it;
  both directories were deleted by hand.
- `tests/path-b-hardening.test.js` still listed `rig` among the ten mandatory
  skills, and `tests/upstream-fetch.test.js` proved staging cleanup by
  snapshotting `os.tmpdir()` — a directory shared with every other test file
  `node --test` runs in parallel, so another file's staging directory read as
  this fetch's leak. The fetch takes a `stagingRoot` option already, so the test
  now passes a private root and asserts it is empty; cleanup itself was never
  broken (it is in a `finally`).

In flight: nothing. Next: commit the tree, then the owner pushes and opens the
single PR to `qa-prod` (T-10.7), which is also what unblocks the exact-SHA CI
boxes T-2.9, T-6.7 and T-8.8.
