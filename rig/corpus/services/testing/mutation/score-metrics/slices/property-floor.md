# testing.mutation.score-metrics — property-floor slice

Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Assurance remains Policy grade.

This slice verifies the configured `killed_mutants` rule using `score-metrics-slice-property-floor`. Compute sensitivity from valid mutants and make denominator exclusions explicit.

The accepted fixture contains `killed_mutants` = `8`; the invalid fixture demonstrates the missing-field case. This checks policy shape only, not a property of generated mutants.
