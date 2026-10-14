# testing.mutation.score-metrics — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for score metrics. The evidence must preserve the killed_mutants, valid_mutants, include_invalid_mutants_in_score inputs that determined the result. Binding checks: score-metrics-evidence-receipt.

Ground the decision in a second run against unchanged score metrics inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: score metrics configuration validation only; declared policy does not prove running score metrics behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.score-metrics:evidence-replay. Given the mutation.score-metrics binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Owned scope: `mutation.score-metrics`.

Offer: Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Input: `rig-services/testing.mutation.score-metrics.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: score metrics configuration validation only; declared policy does not prove running score metrics behavior. Select an approved repository-owned command to verify that behavior.

minimal: killed mutants — 8.

mid: valid mutants — 10.

maximal: include invalid mutants in score — false.
