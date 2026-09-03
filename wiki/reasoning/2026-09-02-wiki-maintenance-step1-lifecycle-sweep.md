---
date: 2026-09-02
source: agent
topics: agent-working-conventions
decisions:
status: historical
supersedes:
tags:
summary: Wiki maintenance Step 1 (lifecycle sweep) — flipped 14 non-Path B traces from current to historical because their referenced tickets have merged to qa-prod; kept all Path B traces current because Path B is unmerged on this branch, and kept the vision/scoping snapshots current because they still describe live decisions.
---

# Wiki maintenance Step 1 — lifecycle sweep

## Scope

The routine's Step 1 lifecycle sweep flagged 37 `status: current` traces. This
change resolves the ones whose underlying work has landed on `qa-prod`, and
leaves everything else current per intent-owner direction.

## Kept current — Path B (unmerged)

The current branch `path-b-adaptive-onboarding-oracle` has not merged to
`qa-prod`. Every Path B trace — the slice notes, the hardening issue fix
notes, the technical spec, product-direction lock, follow-up decisions, adapt
scope, acceptance oracle, implementation resumption, remediation, hardening
final review, and the operator check — stays `status: current` even though
individual traces say fixes "landed on the branch". The umbrella feature is
still open work.

## Kept current — durable references

Two 2026-08-30 traces are snapshots of decisions that are still live rather
than reports on a shipped ticket, so they stay current:

- `2026-08-30-rig-product-vision-and-tiered-adaptive-install.md` — end-product
  vision that Path B is executing against.
- `2026-08-30-office-hours-path-a-path-b-scoping.md` — Path A/B order and
  scoping the current branch continues to follow.

## Flipped to historical — merged to qa-prod

Verified merged into `qa-prod` by commit / PR (see `git log origin/qa-prod`):

- `2026-08-31-routing-hygiene-close-out.md` — filename rule; RIG-151/152/124.2
  merged in PR #135.
- `2026-08-31-routing-hygiene-traceability-fix.md` — body: "hygiene bundle
  landed"; PR #135.
- `2026-08-31-routing-hygiene-design.md` — design that shipped through the
  close-out above.
- `2026-08-31-routing-hygiene-oracle.md` — grilling oracle for the same
  bundle; shipped through PR #135.
- `2026-08-31-routing-md-adaptation-not-transform.md` — reframe decision that
  drove the RIG-151/152 fix; shipped through PR #135. The decision itself is
  indexed in `wiki/index/decisions.md`; this trace is the snapshot.
- `2026-08-31-rig-154-close-out.md` — filename rule; PR #140.
- `2026-08-31-rig-153-close-option-b-deferred.md` — body: "RIG-153 closed";
  PR #141.
- `2026-08-31-rig-153-instrument-spec.md` — RIG-153 spec that shipped;
  PR #139.
- `2026-08-31-rig-148-gitignore-oracle.md` — RIG-148 shipped; PR #137.
- `2026-08-30-routing-sop.md` — routing SOP shipped; PR #134.
- `2026-08-30-path-a-bug-investigation.md` — investigation report; backlog
  filed and merged in PR #124.
- `2026-08-30-generated-wiki-summary-design.md` — generator shipped;
  PR #118.
- `2026-08-30-development-process-handoff.md` — the process changes described
  shipped in the surrounding PRs; the handoff itself is a past event.
- `2026-08-30-adaptation-eval-claude-task-master.md` — first eval snapshot
  merged in PR #123.

## Not touched (still needs judgment)

None. Every flagged trace is either flipped above, in the durable-reference
list, or is Path B (kept current per direction). No `<!-- needs-human-review:
status -->` markers were added.

## Follow-up

- Rerun `node scripts/build-wiki-index.js` so `wiki/status.md` reflects the
  new bucket.
- Steps 2–7 remain outstanding; they will follow one PR per step.
