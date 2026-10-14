# testing.mutation.ci-gate-policy — identity

Policy grade: ci gate policy owns mutation.ci-gate-policy. Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Keep sibling services in mutation under their own verdicts. Tie acceptance to the configured input at `rig-services/testing.mutation.ci-gate-policy.json`; malformed input is still attributed to that path.

Disposition: convention. Read the limit: ci gate policy configuration validation only; declared policy does not prove running ci gate policy behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.ci-gate-policy:policy-boundary. Given source-code is present and mutation.ci-gate-policy is selected, pass only when the repository binding evaluates mutation.ci-gate-policy and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern.

Service-specific evidence cues:
Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Owned scope: `mutation.ci-gate-policy`.

Offer: Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Input: `rig-services/testing.mutation.ci-gate-policy.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: ci gate policy configuration validation only; declared policy does not prove running ci gate policy behavior. Select an approved repository-owned command to verify that behavior.

minimal: minimum score percent — 70.

mid: timeout policy — "fail-inconclusive".

maximal: allow unrun mutants — false.
