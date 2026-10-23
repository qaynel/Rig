---
date: 2026-10-23
source: agent
topics: the-overhaul
decisions:
status: current
tags: verification, regression, trap
summary: Running PR 153's test plan found the never-run clean-install E2E and release-eligibility/health workflows stale against the code; fixed on the branch, full-gate regression on the final commit in flight.
---

Test plan for PR 153 run at head 8a22c60f. Item 1 (`npm test` on a clean clone) passed. Items 2-4 targeted suites passed (298/299; the one miss, the browse "importer killed" descendant test, is a CPU-load flake and passes 3/3 alone).

Item 5 failed for real. The e2e, health and release-eligibility workflows have never run on GitHub because they are not on the default branch, so CI could not catch drift. `scripts/clean-install-e2e.js` signed `rig-plan-approval\ndigest=...` but `rig/lib/onboarding.js` approvalMessage now also binds `repository=<sha256 of realpath target>`, so onboarding apply died with SSHSIG verification failed. Fix: the script now calls approvalMessage itself, so signer and verifier cannot drift. The exact-SHA E2E then passes both scenarios against a `git archive` of the commit.

A high-effort audit of the same workflows found: `check-deployment-gate.js` step 3 ran `npm test` with the runner's CI/GITHUB_ACTIONS set, which the suite rejects (test.yml and health.yml unset them); the release-eligibility checkout was depth 1 but migrate-v5 tests need history (`git show b7f72117:...`); health and release-eligibility lacked setup-python that test.yml has. All three fixed. Not fixed, unverified: the `health` label is not created by report-health-issue.js, and whether `issues: write` auto-creates it is unconfirmed.

Trap: workflows that only run on the default branch need a local run of their commands before merge; "files present" is not "green".

In flight: independent full-gate regression on the final commit. Next: push, tick the PR test plan, comment.
