# testing.mutation.ci-gate-policy — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for ci gate policy. It checks minimum_score_percent (minimum 70): minimum score percent must meet the configured minimum of 70.. Binding checks: ci-gate-policy-source-code-boundary.

Ground the decision in a repository-owned command or existing native check that can observe mutation.ci-gate-policy; bind it to the input named in `rig-services/testing.mutation.ci-gate-policy.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside mutation.ci-gate-policy is a failure.

Acceptance target: fixture:testing.mutation.ci-gate-policy:policy-boundary. Given source-code is present and mutation.ci-gate-policy is selected, pass only when the repository binding evaluates mutation.ci-gate-policy and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Owned scope: `mutation.ci-gate-policy`.

Offer: Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Input: `rig-services/testing.mutation.ci-gate-policy.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: ci gate policy configuration validation only; declared policy does not prove running ci gate policy behavior. Select an approved repository-owned command to verify that behavior.

minimal: minimum score percent — 70.

mid: timeout policy — "fail-inconclusive".

maximal: allow unrun mutants — false.
