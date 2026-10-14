# testing.mutation.score-metrics — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for score metrics. The evidence must preserve the killed_mutants, valid_mutants, include_invalid_mutants_in_score inputs that determined the result. Binding checks: score-metrics-evidence-receipt.

Ground the decision in a second run against unchanged score metrics inputs. Record the killed_mutants, valid_mutants, include_invalid_mutants_in_score inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this score metrics result is stale. The ceiling remains: score metrics configuration validation only; declared policy does not prove running score metrics behavior. Choose a repository-owned check that observes score metrics from rig-services/testing.mutation.score-metrics.json.

Acceptance target: fixture:testing.mutation.score-metrics:evidence-replay. Given the mutation.score-metrics binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.
minimal: killed mutants — 8.
mid: valid mutants — 10.
maximal: include invalid mutants in score — false.
