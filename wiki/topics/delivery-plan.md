# The delivery plan

## What it is

Gate 2 divides implementation into 15 ordered tracer-bullet slices: executable
specification, service authorship, policy, approval, evaluator, sanitation,
git/CI evidence, runner, hosts, providers, global writes, lifecycle,
distribution, all 115 leaves, then the final matrix and review. [Gate 2 §14](../gate2/technical-spec.md#14-ordered-tracer-bullet-slices)

## Why it is this way

The ordering builds the oracle and trust roots before product behavior, then
adds one end-to-end mechanism at a time. Sequential service authorship is
intentional because bulk generation caused the placeholder state this plan must
replace. The final slice rechecks exact integration rather than summing local
claims. [Gate 2 §14](../gate2/technical-spec.md#14-ordered-tracer-bullet-slices)

The delivery posture is hybrid when product options fork: use Rig where it
amplifies the host and repository, and let the host own the ongoing context and
updates where it already has the better surface. That keeps "plug and play"
from becoming a parallel product that repeats what the project already has.
[Product-spirit hybrid trace](../reasoning/2026-08-20-product-spirit-hybrid.md)

The delivered shape is therefore a packaged forward-deployed harness: ship the
tools, inspect the target repository, decide how those tools should be applied
there, and help the user set them up without displacing existing infrastructure.
[Packaged harness clarification](../reasoning/2026-08-20-packaged-forward-deployed-harness.md)

## What binds it

`AD-1` fixes the existing implementation seams and legacy compatibility; the
remaining `AD-*` decisions map into the ordered slices. Gate 2 §17 separates
document freeze blockers from built-product release blockers so planning cannot
deadlock itself. [Decision index](../index/decisions.md)
[Gate 2 §17](../gate2/technical-spec.md#17-candidate-freeze-blockers)

## What was rejected

Parallel catalogue authoring, implementation before the executable oracle,
merging freeze and release blockers, and treating the current placeholder tests
as a base were rejected. [Rejected approaches](../index/rejected.md)
[Known traps](../index/traps.md)

## Authorities and sources

- Current ordered design: [Gate 2 §14](../gate2/technical-spec.md#14-ordered-tracer-bullet-slices)
- Approved wiki migration design: [reasoning trace](../reasoning/2026-08-19-wiki-design.md)
- Product-direction review: [reasoning trace](../reasoning/2026-08-19-product-direction-review.md)
- First vertical-slice handoff (lint-format): [reasoning trace](../reasoning/2026-08-19-lint-format-vertical-slice.md)
- Vertical lint-format production ruling: [reasoning trace](../reasoning/2026-08-20-vertical-lint-format-production.md)
- Consolidated lint-format production intent: [spec](../specs/lint-format-intent.md)
- Current first-leaf production context: [reasoning trace](../reasoning/2026-08-20-lint-format-production-context.md)
- Production grilling gap audit: [reasoning trace](../reasoning/2026-08-20-lint-format-production-grilling-audit.md)
- Release-contract reconciliation for audit questions 1–3: [reasoning trace](../reasoning/2026-08-20-lint-format-grilling-release-contract.md)
- First-attempt retrospective (what not to do): [reasoning trace](../reasoning/2026-08-20-first-attempt-retrospective.md)
- Cleanup survey rulings: [reasoning trace](../reasoning/2026-08-20-cleanup-survey-decisions.md)
- Product spirit and hybrid posture: [reasoning trace](../reasoning/2026-08-20-product-spirit-hybrid.md)
- Packaged forward-deployed harness clarification: [reasoning trace](../reasoning/2026-08-20-packaged-forward-deployed-harness.md)

## What is still open

D24 and the one-gate contract are now owner-approved and landed in both Gate 1
files. Before implementation, the complete 68-case deterministic testing
infrastructure must be built and manifested, and the owner must sign that
manifest together with intent and acceptance. Gate 2 is a present working
technical approach, not a second freeze; it must be retraced to D24 before the
oracle is presented for signature.
[Status](../status.md#ordered-next-steps)
[Gate 2 re-trace trace](../reasoning/2026-08-21-gate2-lint-format-retrace.md)

The former lint-format-only path is historical. D24 supersedes D21's release
boundary and retires D23: all 115 Policy leaves are now release-blocking, while
lint-format remains the only currently evidenced higher-grade vertical. The
default-on safety baseline and full 19-host/six-provider commitment remain.
[Vertical production ruling](../reasoning/2026-08-20-vertical-lint-format-production.md)
[Production context](../reasoning/2026-08-20-lint-format-production-context.md)
[Grilling audit](../reasoning/2026-08-20-lint-format-production-grilling-audit.md)
[Release-contract reconciliation](../reasoning/2026-08-20-lint-format-grilling-release-contract.md)

The first probe already did useful work: `development.code-quality.lint-format`
was authored end to end as a falsifiable check on "intent clear, code cheap."
Its deliberate mid-install interrupt exercised the `AT-INSTALL-1`
rollback-vs-resume contradiction, forced that hole into running code, and the
hole is now resolved in both Gate 2 candidate text and `rig/lib/apply.js`.
[Lint-format vertical slice](../reasoning/2026-08-19-lint-format-vertical-slice.md)

[Resolution](../reasoning/2026-08-20-resolve-at-install-1.md)

This one leaf's own current state and the ordered path from here to it
counting as a production leaf — not just a probe — is tracked separately and
kept current: [lint-format roadmap](../specs/lint-format-roadmap.md).

## The MVP reorder (D24, 2026-08-21)

**D24 reorders the front of the fifteen-slice plan for time-to-beta.** The
plan's later slices survive unchanged; what changes is the early sequence and
the release shape. The catalogue no longer ships one deep leaf but all 115 at
the Policy rung, authored in one pass at agent discretion.

The MVP order, each step with one verifiable outcome:

1. Repair the record (done 2026-08-21).
2. Build all 68 deterministic targets, the first-running oracle verifier, and
   `npm run test:code`; manifest the test bytes and obtain the owner signature.
   Product-behavior failures are expected before implementation.
3. Wire all 55 swallowed skills and ship a real install path (`install.sh`,
   `5.0.0`). First step that produces something a stranger can hold.
4. Context-aware onboarding: mechanical host detection, write only into trees
   that exist, explicit trimmable family selection.
5. Author all 115 leaves at Policy grade, in family batches.
6. Prove the unchanged signed `AT-SHAPE-6` target green across all 115.
7. Release: fresh review, production evidence, `v5.0.0`.
8. After beta, promote leaves Policy → Context → Evidence on evidence of use,
   under the ordinary gate with owner review restored.

Sequential authorship (locked decision 8) is suspended for step 5 and returns at
step 8. The owner has approved D24 and the MIT distribution ruling; the
non-delegable signature remains after the tests are complete.
Full detail, verify commands, and traps: [the MVP roadmap](../specs/mvp-roadmap.md).
[Ruling](../reasoning/2026-08-21-mvp-agent-discretion-build.md) ·
[Owner approval](../reasoning/2026-08-21-d24-owner-approval.md) ·
[v0.12 retrace](../reasoning/2026-08-22-gate2-v0.12-d24-retrace.md)
