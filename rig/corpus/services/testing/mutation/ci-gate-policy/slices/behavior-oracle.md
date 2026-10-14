# testing.mutation.ci-gate-policy — behavior-oracle slice

Policy grade slice. This slice bounds ci gate policy to mutation.ci-gate-policy. It uses `ci-gate-policy-slice-behavior-oracle` and checks minimum_score_percent (minimum 70): minimum score percent must meet the configured minimum of 70..

Anchor the review on a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.mutation.ci-gate-policy.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than ci gate policy configuration validation only; declared policy does not prove running ci gate policy behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Owned scope: `mutation.ci-gate-policy`.

Offer: Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Input: `rig-services/testing.mutation.ci-gate-policy.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: ci gate policy configuration validation only; declared policy does not prove running ci gate policy behavior. Select an approved repository-owned command to verify that behavior.

minimal: minimum score percent — 70.

mid: timeout policy — "fail-inconclusive".

maximal: allow unrun mutants — false.
