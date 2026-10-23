# Close everything — master plan

**Status:** review amendments applied, 2026-10-13. All six owner questions are
settled in section 9. Release-oracle amendments are not yet signed; product
implementation has not started.

**Consolidated handoff:** [Specification sheet](specification-sheet.md) ·
[Statement of work](statement-of-work.md). The sheet consolidates product and
technical requirements; the SOW defines delivery and completion evidence.
This master owns the item ledger and subplan routing. The subplans retain
execution detail; all documents follow the settled owner decisions and the
protected oracle's human-only amendment process.

**Branch:** `vaibhav-kodiyan/universal-issues-closure` → one PR to `qa-prod`,
then `prod`. **Base SHA at planning:** `051a819c`.

This is the one plan. Every workstream has a subplan; each subplan carries its
own current state, approach, acceptance, tests, dependencies, and risks. This
page owns only what crosses subplans: intent, the item ledger, order, the
signing strategy, cross-cutting risks, and settled delivery decisions.

---

## 1. Intent (owner, 2026-10-13)

Close every open, buggy, or half-built item so the owner can start the redesign
from a clean slate, and ship a coherent, usable product to QA and then prod.

- **Horizontal axis:** every item reaches a proven disposition and both trackers
  (GitHub and the wiki board) agree with the code.
- **Depth axis:** the whole product reaches end-product finish: a fix plus a
  test that proves it, a real clean install end to end, docs that match,
  security and code review, and a coherence check that keeps everything in sync.
- **Close bar:** "code is cheap". Fix it. "Replaced" needs a strong, written
  replaced-by reason. Difficulty or priority is never a reason.
- **Never-started work** is closed on GitHub with a `redesign` label and listed
  on one redesign backlog page.

Owner answers, verbatim:
[r1](../../reasoning/2026-10-13-close-everything-owner-answers-round1.md) ·
[r2](../../reasoning/2026-10-13-close-everything-owner-answers-round2.md) ·
[r3](../../reasoning/2026-10-13-close-everything-owner-answers-round3.md) ·
[r4](../../reasoning/2026-10-13-close-everything-owner-answers-round4.md) ·
[r5](../../reasoning/2026-10-13-close-everything-owner-answers-round5.md) ·
[reality audit](../../reasoning/2026-10-13-close-everything-reality-audit.md).

## 2. North star (settled — reviewers must not re-open)

The North star list at the top of `CLAUDE.md` holds these. In short:

1. **One central Rig corpus**, unpacked by the user's own agent. Never scope,
   test, or document per host. Design:
   [2026-09-08 brainstorm](../../reasoning/2026-09-08-dynamic-offboarding-architecture-brainstorm.md),
   validated by a [feasibility test](../../reasoning/2026-09-08-dynamic-projection-feasibility-test.md)
   and a [script test](../../reasoning/2026-09-08-dynamic-projection-script-test.md).
2. Onboarding is agent-driven and adaptive.
3. The markdown-only rule is retired; scripts, markdown, and MCP may ship.
4. The human-signed oracle is the gate, with one batched re-sign at the end.
5. Code is cheap.

Also settled during grilling: one branch and one PR; heavy upkeep;
lint-format replacement keeps old config through the undo record; freeze the
built catalogue contract **and** finish all original 115 capabilities; compatible,
documented duplicate merges may reduce the service count. The corpus is built
on this branch and delivers them all; AI development standards are enforced
here and ship inside the corpus.

## 3. Subplans

| # | Subplan | Owns | Depends on |
|---|---|---|---|
| 01 | [Tracker sync](01-tracker-sync.md) | Both trackers match reality; redesign backlog page | — |
| 02 | [Bug fixes](02-bug-fixes.md) | RIG-127.11, 127.12, 145, 146, 147, 135.1–.3 | — |
| 03 | [Central corpus](03-central-corpus.md) | D9: corpus, projector, onboarding instructions, v5 migration; RIG-125, 132, 110 | 02 (shares payload/lifecycle code) |
| 04 | [Catalogue services](04-catalogue-services.md) | D8: all original catalogue capabilities finished; RIG-112 | 03 |
| 05 | [Lint-format setup rule](05-lint-format-setup.md) | RIG-113 | 03 |
| 06 | [Clean-install E2E](06-clean-install-e2e.md) | D1; RIG-155 | 03 |
| 07 | [AI development standards](07-ai-sdlc-standards.md) | D7 | 03 |
| 08 | [Coherence and upkeep](08-coherence-and-upkeep.md) | D5, D6 | 01, 03 |
| 09 | [Docs and vision](09-docs-and-vision.md) | D2 | 03, 04, 07 |
| 10 | [Review, sign, ship](10-review-sign-ship.md) | D3, D4, batched signature, PR, QA→prod, tracker closure | all |

## 4. Item ledger (every tracker item, one row)

| Item | Disposition | Subplan |
|---|---|---|
| RIG-148, 149, 150, 153, 154 | Verify-close: fixed in code, trackers wrong | 01 |
| RIG-127.11, 127.12, 145, 146, 147 | Fix | 02 |
| RIG-135.1, 135.2, 135.3 | Reopen, then fix | 01 → 02 |
| RIG-155 | Fix (rescoped host-agnostic) | 06 |
| RIG-125, 132, 110 | Fix via the corpus | 03 |
| RIG-112 | Finish: freeze the built contract plus all original catalogue capabilities | 04 |
| RIG-113 | Finish | 05 |
| RIG-116, 122, 130, 133, 156 | Redesign: never started | 01 |

**Replaced:** none. Every row is a fix, a finish, a verify-close, or an
owner-directed redesign deferral.

## 5. Order

```
01 tracker sync ─┐
02 bug fixes ────┼─▶ 03 corpus ─┬─▶ 04 services ─┐
                 │              ├─▶ 05 lint-fmt ──┤
                 │              ├─▶ 06 E2E ───────┤
                 │              └─▶ 07 standards ─┼─▶ 09 docs ─▶ 08 coherence ─▶ 10 review/sign/ship
```

01 and 02 run first because they don't touch the layout the corpus rewrites.
03 is the spine. 04–07 run in parallel on top of it. 09 comes after the product
it describes, and 08's sweep runs last so it checks the final state. One commit
per slice, with a reasoning trace at every subplan boundary.

## 6. Signing strategy (cross-cutting)

**Problem found in self-review.** 10 of the 16 files pinned by the signed
manifest (`wiki/gate1/testing-infrastructure.manifest`) reference the current
skill or catalogue layout. The corpus move in 03 will therefore invalidate most
of the frozen contract, not only the handful of cases this plan meant to edit.

**Approach.**

- Projection keeps the **installed** layout byte-identical wherever a frozen
  test checks installed output, so most frozen tests stay green unchanged.
- Inventory every affected frozen assertion and verification step: source
  paths, service wording/grades, removed APIs, package-script snapshot, fixed
  acceptance counts, manifest entries, and technical-spec trace targets.
  Prepare exact proposed diffs outside `wiki/gate1/`; protected originals stay
  untouched until the owner applies the bundle.
- The owner-authorized single final signature is a scoped exception to the
  ordinary freeze-before-code sequence for this branch. Candidate tests are
  provisional evidence, never signed acceptance.
- Define a separate advisory candidate runner, outside signed plumbing, that
  runs unsigned regression checks and exercises candidate oracle amendments
  in an isolated copy. Record verifier failures separately from case failures;
  require the exact expected failure set, and reject new or missing failures.
  `npm test` remains authoritative and fail-closed, never relabelled green.
  Package-script and verifier changes join the final owner bundle.
- At the end, the owner applies the bundle, reviews it, and signs once, using
  the bulk re-sign the owner asked for. `gate1-pin` goes green only after that,
  so the signature comes before the PR.

## 7. Cross-cutting risks

| Risk | Mitigation |
|---|---|
| One very large PR (the branch that became PR #143 reached 74 commits) | One commit per slice, each subplan reviewed with its dependent seams, then final-head review, and a trace at each boundary. |
| Existing v5 installs break when the layout changes | 03 stages a resumable migration, preserves preimages and user edits, and proves reversal across both versions. |
| The corpus is a breaking change | Release as **6.0.0** (10). |
| Agent-written projection scripts for unknown hosts execute code | 03 requires an enforced filesystem/network sandbox before execution, approved output validation, and fail-closed behavior when isolation is absent. |
| D8 scale: 115 services × guidance, detector, check, and two fixtures | Batch by family, share fixture scaffolding, and enforce a per-service gate (04). |
| Scheduled jobs fail silently | Failures open or refresh a labelled GitHub issue (08). |
| Instruction drift from the shipped rule copies | The six shipped rule copies become projections in 03, and the stale markdown-only line is fixed there. |

## 8. Self-review: what changed from draft v1

1. **Order was wrong.** v1 built services and docs before the corpus they live
   in. Now the corpus is the spine (§5).
2. **No migration for v5 installs.** Added to 03.
3. **No version decision.** The corpus breaks the layout, so the release is 6.0.0.
4. **Frozen-test coupling was underestimated.** It hits 10 of 16 pinned files.
   Strategy in §6.
5. **The clean-install E2E was scoped to one host.** Rescoped to host-agnostic,
   per North star 1.
6. **D8 had no scale plan.** Batching and a per-service gate are added in 04.
7. **The trust boundary for agent-written projection scripts was missing.**
   Added to 03.
8. **Scheduled jobs had nowhere to report.** Added to 08.
9. **The tracker sync check needs GitHub API access in CI.** Uses the built-in
   workflow token, read-only (08).
10. **The draft spec mixed ledger and design.** Split into these subplans.
11. **Third-party delivery (6.9 MB) was unaddressed.** Owner chose fetching
    during onboarding; pinned metadata and required local patches stay central.
12. **The "tier" vocabulary conflicts with the corpus.** Remove the wording
    now and retain the compatible flag for one release (owner decision).
13. **The stale line in the shipped rule copies** is fixed in 03, not by hand.

## 9. Owner decisions (all six settled during independent review)

1. **Third-party delivery — decided:** owner chose **fetch during onboarding**.
   The source shelf contains 55 SKILL.md files; inventory actual upstream
   projects instead of treating the draft's 17 as a skill count. Corpus fetch
   metadata pins revisions/digests, licences and local patches. Clear download
   and integrity refusals replace the offline-vendoring promise.
2. **Corpus location — decided:** owner chose **one new root**; use
   `rig/corpus/`. Enumerate path migrations and frozen amendments.
3. **Tier wording — decided:** remove active user-facing wording now, while
   keeping `--tier 1` compatible for one release. Reject unsupported values;
   preserve existing runtime/approval behavior instead of accepting arbitrary
   tier input as a no-op.
4. **External-tool policy — decided:** use available tools. Missing tools
   produce named coverage gaps with setup guidance, never silent passes or
   automatic installation. Third-party skill fetching remains separate.
5. **Duplicate services — decided:** proven duplicates may merge, with a
   written reason and compatibility for existing selections. The count may
   fall below 115; every original capability remains finished and covered.
   Preserve old IDs through selection/dependency/receipt migration tests.
6. **QA→prod promotion — decided:** automated checks only. Require successful
   health/full-gate/coherence and real-download clean-install evidence on the
   exact QA commit; an outside-repository manual install is not a prerequisite.
   Promote the checked commit and reject stale or unrelated run evidence.
