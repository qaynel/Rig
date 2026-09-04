---
date: 2026-09-02
source: agent
topics: onboarding-flow, gate1-signing, delivery-plan
decisions:
status: historical
supersedes:
tags: verification, handoff
summary: Path B branch closeout — Fix 3a + Fix 3b (already landed), staleHubs corrected, unfreeze draft filed; full CI gate green modulo 4 tests that require a host capability this sandbox does not have (documented, pre-existing, CI works around it); three human-only blockers remain.
---

# Path B branch closeout — pre-handoff gate

**Full CI gate:** `npm run test:secrets`, `check-rule-copies.js`,
`check-versions.js` (including the skill-catalog freshness check), and
`node --test tests/*.test.js` all ran. 695 tests, 691 pass, 4 fail — all four
failures are `network_isolation_unavailable`: `runGrade`'s host-capability
probe (`unshare --user --map-root-user --net --`) fails in this sandbox
because unprivileged user namespaces are not permitted here
(`unshare: write failed /proc/self/uid_map: Operation not permitted`). This
is the exact, previously-diagnosed condition in
[2026-08-28 linux-network-isolation-ci](2026-08-28-linux-network-isolation-ci.md):
GitHub Actions' Ubuntu 24.04 runner explicitly disables the AppArmor
restriction on unprivileged user namespaces for the test job so this probe
succeeds in real CI; a locked-down local sandbox without that workaround
gets the designed fail-closed `network_isolation_unavailable` state instead
of a silent pass. Confirmed unrelated to this branch's changes: none of the
four failing tests (`AT-LF-11`, `AT-LF-12`, `AT-LF-23`,
`release-blockers.test.js`'s lint-grade-evidence case) touch onboarding,
wiki-maintenance, or gate1 code. `pi-extension` (15/15) and `rig-mcp` (6/6)
subproject suites pass cleanly.

A second, purely local artifact was cleared before this run: every tracked
file's on-disk permissions were `664` against git's recorded `644`, because
this session's umask (`002`) differs from the checkout's original umask
(`022`). That made `rig/catalog/skills/catalog.json`'s content-plus-mode
digest check fail for all 63 unrelated skills — not a real drift, confirmed
by running the generator twice (byte-identical output) and sampling 500
tracked files (all showed the same uniform mismatch). Fixed by `chmod`-ing
every tracked file back to git's recorded mode — a working-tree-only
correction with zero `git diff`, not a commit.

**Signed oracle:** verified, 14 files, 83 acceptance cases
(`node scripts/check-advanced-spec.js`).

**path-b hardening suite:** 64/64 pass (part of the 691). Fix 3a
(interrupt-window) and Fix 3b (sibling-file reconcile) hold under the new
tests, already committed in `ca5b4e7`.

**Wiki-maintenance:** `staleHubs` and `lintFindings` now pass their
fixtures (7/7) and the real-repo integration check
(`tests/wiki-maintenance-lint.test.js`, 1/1). The `status: current`-only
filter from `2026-09-02-wiki-maintenance-step6-lints.md` was itself a
CLAUDE.md violation (see
[staleHubs fix trace](2026-09-02-path-b-branch-closeout-staleHubs-fix.md));
corrected to count every citing trace dated on/after `FRONTMATTER_FLOOR`,
keyed to each trace's first-add commit so a later lifecycle-flip edit can't
retrigger false staleness.

**What remains before merge (human-only):**

1. Confirm authorisation of the `ecdsa-sha2-nistp256` key rotation on
   commit `5694fd7b` (Secretive/Manoj's-MacBook-Pro.local). If
   authorised: add a key-class comment on the allowed-signers line and
   a wiki trace recording the rotation. If not: the oracle cannot be
   trusted and the branch needs a full re-sign under the previous
   ed25519 key.
2. Edit `wiki/gate1/acceptance.md` H1 (drop "AWAITING ORACLE SIGNATURE")
   and §7 lead-in (drop "submitted for owner approval"), then re-sign
   the oracle with the gate1 key.
3. Fill in the Date + "I authorize" + signature blocks in
   `wiki/gate1/unfreeze-requests/2026-09-01-path-b-approval-receipts.md`
   AND
   `wiki/gate1/unfreeze-requests/2026-09-02-check-advanced-spec-83-cases.md`.

None of these can be performed by an agent; each requires the human
holder of the gate1 key.
