# ci gate policy

Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Owned scope: `mutation.ci-gate-policy`.

Offer: Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Input: `rig-services/testing.mutation.ci-gate-policy.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: ci gate policy configuration validation only; declared policy does not prove running ci gate policy behavior. Select an approved repository-owned command to verify that behavior.

minimal: minimum score percent — 70.

mid: timeout policy — "fail-inconclusive".

maximal: allow unrun mutants — false.

