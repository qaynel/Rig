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

No implementation slice may start while Gate 1 and Gate 2 disagree about the
release boundary or while Gate 2 is a failed candidate. Gate 1 is now amended
(D21) and re-frozen at 68 cases; the next work is for `rig-product-design` to
re-trace `AT-LF-1`–`AT-LF-19` into Gate 2 §13, reconcile the gates, resolve the
remaining three round-3 findings, and obtain a fresh passing review.
[Status](../status.md#ordered-next-steps)

The intent owner chose `development.code-quality.lint-format` as the first
production leaf instead of waiting for horizontal all-leaf authorship. The same
release keeps normal Rig's default-on safety baseline and full
19-host/six-provider commitment; it is not a limited preview. Candidate Gate 2
already recorded the vertical choice, and frozen Gate 1 now matches it: D21
(2026-08-21) narrows the release condition to this one leaf, and the other 114
remain committed but non-blocking for this release. All twenty lint-format
product questions in the grilling audit are closed and the Gate 1 amendment has
landed; only Gate 2's re-trace and re-freeze remain.
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
