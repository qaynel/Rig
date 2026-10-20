# testing.mutation.ci-gate-policy — property-floor slice

Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Assurance remains Policy grade.

This slice verifies the configured `minimum_score_percent` rule using `ci-gate-policy-slice-property-floor`. Set a mutation score threshold and decide how inconclusive runs affect CI.

The accepted fixture contains `minimum_score_percent` = `70`; the invalid fixture demonstrates the missing-field case. This checks policy shape only, not a property of generated mutants.
