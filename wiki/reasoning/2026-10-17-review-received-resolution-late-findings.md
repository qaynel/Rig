---
date: 2026-10-17
source: agent
topics: the-overhaul, review-receipts, trust-and-failure-boundaries, distribution-and-release, onboarding-flow
decisions:
status: historical
supersedes:
tags: review, migration, exact-sha, retry
summary: Follow-up review defects have acceptance criteria and focused regressions; final full-gate, exact-QA workflow runs, binding receipt, and owner approval remain.
---

The report-only reviews continued beyond the original four findings. Follow-up
migration checks now cover both interruptions around transaction publication,
including a process exit after the final hard link. Resume adopts only a regular
byte-identical pre-publication record, removes only a same-inode post-publication
temp link, and refuses other collisions. The migration temp lives at
`.rig-migration.json.tmp` in the repository root so swapping `.rig` cannot
redirect temp cleanup. Parent swaps before temp creation, final publication, and
temp unlink have injected tests that preserve external inventories.

The MCP retry path now validates that its setup marker is an applied journal
write whose digest matches live bytes. Unowned and edited markers are preserved
and refused before npm runs. The OpenClaw pending ledger remains pending if a
retry's dependency setup fails after ambiguous `set`/`show` errors. A public
install without `--openclaw-mcp` now forces the setup-only request off, including
for v5 upgrades with an MCP-emitting host; the explicit option remains the
registration path. These behaviors are covered by the migration/bootstrap
regressions and align with Gate 2 AD-38 and the frozen AT-HOME-1/AT-DIST-1
requirements.

The exact-SHA E2E downloads the GitHub archive, records its URL and digest,
compares its extracted inventory with the local archive of the resolved commit,
and passes both archive digest and expected extracted-tree digest to the public
installer. The installer checks the archive digest and tree digest before
executing bootstrap. Stubbed-curl tests reject mismatched archive bytes and a
valid archive with a wrong tree digest, while a matching archive completes.

Latest focused verification passed `node --test tests/migrate-v5.test.js
tests/rig-bootstrap.test.js` (45/45) and
`node --test tests/review-received-diagnostics.test.js
tests/release-eligibility-workflow.test.js tests/release-blockers.test.js
tests/deployment-policy-docs.test.js tests/e2e/installer-artifact.test.js`
(51/51). The signed oracle passed with 16 files and 95 acceptance cases.
These checks predate the final full repository run; `npm test` must still run on
the final committed candidate. The fresh independent report-only review is
still in flight.

No exact-QA Linux/macOS run URLs or artifacts can bind until an authorized
candidate reaches QA. The binding review receipt, push/check verification,
required-check protection proof, independent reviewer approval, merge and PR
closure remain owner-controlled. Earlier review publication returned HTTP 403;
no push, approval, merge, or closure is claimed.
