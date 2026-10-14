# testing.mutation.equivalent-mutant-detector — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for equivalent mutant detector. The evidence must preserve the equivalence_evidence, review_owners, classify_by_survival_only inputs that determined the result. Binding checks: equivalent-mutant-detector-evidence-receipt.

Use a second run against unchanged equivalent mutant detector inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: equivalent mutant detector configuration validation only; declared policy does not prove running equivalent mutant detector behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.equivalent-mutant-detector:evidence-replay. Given the mutation.equivalent-mutant-detector binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Owned scope: `mutation.equivalent-mutant-detector`.

Offer: Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Input: `rig-services/testing.mutation.equivalent-mutant-detector.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: equivalent mutant detector configuration validation only; declared policy does not prove running equivalent mutant detector behavior. Select an approved repository-owned command to verify that behavior.

minimal: equivalence evidence — ["unreachable branch by domain proof"].

mid: review owners — ["parser maintainer"].

maximal: classify by survival only — false.
