# testing.mutation.ci-gate-policy — minimal

Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Grade: minimal. Assurance remains Policy grade. This check rejects a policy with no minimum_score_percent: the bad fixture has `minimum_score_percent` = `-1`, while the accepted fixture has `minimum_score_percent` = `70`.

Set `minimum_score_percent` to at least 70. The result says only that the configured operator or input is present. Choose the minimum score before evaluating a run; the example threshold is 70 percent.

Input: `rig-services/testing.mutation.ci-gate-policy.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: ci gate policy configuration validation only; declared policy does not prove running ci gate policy behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: policy:testing.mutation.ci-gate-policy:minimal:ci-gate-policy-source-code-boundary.

Declared predicates: ci-gate-policy-source-code-boundary: `minimum_score_percent` is numeric and at least 70.

Check: `ci-gate-policy-source-code-boundary`.
