# testing.mutation.ci-gate-policy — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for ci gate policy. The evidence must preserve the minimum_score_percent, timeout_policy, allow_unrun_mutants inputs that determined the result. Binding checks: ci-gate-policy-evidence-receipt.

Start from a second run against unchanged ci gate policy inputs. Record the minimum_score_percent, timeout_policy, allow_unrun_mutants inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this ci gate policy result is stale. The ceiling remains: ci gate policy configuration validation only; declared policy does not prove running ci gate policy behavior. Choose a repository-owned check that observes ci gate policy from rig-services/testing.mutation.ci-gate-policy.json.

Acceptance target: fixture:testing.mutation.ci-gate-policy:evidence-replay. Given the mutation.ci-gate-policy binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.
minimal: minimum score percent — 70.
mid: timeout policy — "fail-inconclusive".
maximal: allow unrun mutants — false.
