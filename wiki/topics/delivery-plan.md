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
- Plain-language roadmap: [roadmap](../specs/roadmap.md)
- Historical task breakdown: [task list](../specs/tasklist.md)
- Approved wiki migration design: [reasoning trace](../reasoning/2026-08-19-wiki-design.md)
- Product-direction review: [reasoning trace](../reasoning/2026-08-19-product-direction-review.md)
- First vertical-slice handoff (lint-format): [reasoning trace](../reasoning/2026-08-19-lint-format-vertical-slice.md)
- First-attempt retrospective (what not to do): [reasoning trace](../reasoning/2026-08-20-first-attempt-retrospective.md)

## What is still open

No implementation slice may start while Gate 2 is a failed candidate. The next
work is to resolve its four round-3 findings, re-review the new digest, have the
intent owner sign Gate 1, and freeze Gate 2. [Status](../status.md#ordered-next-steps)

A prior fork remains live above this plan: whether to author the catalogue
horizontally (freeze all specs, then have the agent burn all 115 leaves at once)
as the intent owner prefers, or vertically (ship one real leaf end to end first,
let it force the spec contradictions out, then freeze and burn the rest). Gate 2
§14 already rejected bulk/parallel authoring as the cause of the placeholder
state; the freeze-then-burn preference reopens that question. [Product-direction review](../reasoning/2026-08-19-product-direction-review.md)

The intent owner agreed to test the fork on one leaf first:
`development.code-quality.lint-format`, authored end to end as a falsifiable
check on "intent clear, code cheap." The build brief and its three acceptance
probes — including the deliberate mid-install interrupt that exercises the
`AT-INSTALL-1` rollback-vs-resume contradiction — are the handoff trace.
[Lint-format vertical slice](../reasoning/2026-08-19-lint-format-vertical-slice.md)
