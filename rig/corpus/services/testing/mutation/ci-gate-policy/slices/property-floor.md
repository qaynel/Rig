# testing.mutation.ci-gate-policy — property-floor slice

Policy grade slice. This slice bounds ci gate policy to mutation.ci-gate-policy. It uses `ci-gate-policy-slice-property-floor` and checks minimum_score_percent (minimum 70): minimum score percent must meet the configured minimum of 70..

For ci gate policy, choose a repository example that satisfies minimum_score_percent at the property-floor floor, plus a failure where minimum score percent must meet the configured minimum of 70. is false. For ci gate policy, wire `property-floor` to `rig-services/testing.mutation.ci-gate-policy.json` and keep its verdict on minimum_score_percent; missing evidence is a named gap, with ceiling ci gate policy configuration validation only; declared policy does not prove running ci gate policy behavior. Choose a repository-owned check that observes ci gate policy from rig-services/testing.mutation.ci-gate-policy.json..

Service-specific evidence cues:
Offer: Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.
minimal: minimum score percent — 70.
mid: timeout policy — "fail-inconclusive".
maximal: allow unrun mutants — false.
