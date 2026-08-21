# Review receipts

## What it is

A review receipt is wrapper-authored JSON binding a fresh, report-only semantic
review to the exact target and Gate 1 digests, with its timestamp and verdict.
Any target-byte change makes the old receipt historical. [Gate 2 AD-29](../gate2/technical-spec.md#2-final-mechanism-decisions)

## Why it is this way

D8 originally asked for a different model, but a model label is self-declared
and cannot establish independence. GA-13 replaced that proxy with properties the
repository can verify: fresh session, no edit authority, and exact-digest
binding written by the wrapper rather than the reviewer. [Advanced grilling GA-13](../sources/logs/advanced-grilling.md#ga-13--d8-review-separation-correction-2026-08-19)

## What binds it

`D8` as corrected by `GA-13`, plus `AD-29` and `AT-GATE-3`, define the contract.
The release gate requires a current passing receipt with no unresolved finding.
[Decision index](../index/decisions.md) [Gate 2 §12.3](../gate2/technical-spec.md#123-release-gate)

## What was rejected

Same-session review, an editing reviewer, author-supplied digest metadata, and a
different-model label as the independence test were rejected. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Review intent: [Gate 1](../gate1/business-spec.md)
- Receipt mechanism: [Gate 2 AD-29](../gate2/technical-spec.md#2-final-mechanism-decisions)
- Review record: [`sources/reviews/`](../sources/reviews/)

## What is still open

Round 4 reviewed Gate 2 v0.6 at `645e5536…` and failed with one blocker, one
major finding, and one minor residual risk. Both accepted defects were corrected
in **v0.7 (`cdd07515…`)** — the grade-ladder short-circuit and grade-aware
repository-CI applicability — which **voided the round-4 receipt**. Round 5 then
reviewed v0.7 and failed with two blockers, four major findings, and two minor
findings. D22/v0.8 (`0f62d984…`) addresses the `AT-CI-3` lint-format CI
contradiction only; D23/v0.9 (`df4b8ec7…`) addresses the `AT-SHAPE-6`
release-scope gap; and v0.10 (`69c38149…`) addresses the round-6 Slice 2,
freeze-timing, and recovery-test claim findings. The remaining round-5 findings
still need product-design resolution before the next report-only review. The
sealed reviewer receives only
Gate 1, Gate 2, and its fixed adversarial prompt — never the correction handoff
or any description of what was changed, so the pass is earned against the bytes
alone. [Round-4 receipt](../sources/reviews/gate2-v0.6-round4.review.json)
[Round-5 receipt](../sources/reviews/gate2-v0.7-round5.review.json)
[Round-6 receipt](../sources/reviews/gate2-v0.9-round6.review.json)
[Correction trace](../reasoning/2026-08-21-gate2-v0.7-round4-corrections.md)
[D22 trace](../reasoning/2026-08-21-evidence-only-lint-format-ci.md)
[Round-6 correction trace](../reasoning/2026-08-21-gate2-v0.10-round6-corrections.md)
[Status](../status.md)
