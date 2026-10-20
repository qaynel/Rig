# testing.mutation.mutant-generator — property-floor slice

Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Assurance remains Policy grade.

This slice verifies the configured `mutation_operators` rule using `mutant-generator-slice-property-floor`. Generate semantic production-code mutations while leaving assertions unchanged.

The accepted fixture contains `mutation_operators` = `["negate conditional"]`; the invalid fixture demonstrates the missing-field case. This checks policy shape only, not a property of generated mutants.
