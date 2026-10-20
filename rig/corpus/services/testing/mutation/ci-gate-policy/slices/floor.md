# testing.mutation.ci-gate-policy — floor slice

Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Assurance remains Policy grade.

This Policy slice checks `minimum_score_percent` through `ci-gate-policy-slice-floor`. The good fixture supplies `minimum_score_percent` = `70`; the bad fixture removes it.

Choose the minimum score before evaluating a run; the example threshold is 70 percent. Keep the failure attached to `rig-services/testing.mutation.ci-gate-policy.json`; do not infer that a mutation was generated or killed. ci gate policy configuration validation only; declared policy does not prove running ci gate policy behavior. Select an approved repository-owned command to verify that behavior.
