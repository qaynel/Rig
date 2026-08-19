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

Round 3 is current and failed. After Gate 2 changes, a new fresh review must
produce a receipt for the new digest; editing the existing receipt would destroy
the evidence chain. [Status](../status.md#the-blocker-round-3-failed)
