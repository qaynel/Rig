# testing.mutation.mutant-generator — floor slice

Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Assurance remains Policy grade.

This Policy slice checks `mutation_operators` through `mutant-generator-slice-floor`. The good fixture supplies `mutation_operators` = `["negate conditional"]`; the bad fixture removes it.

A listed operator is only configuration evidence; it does not show that the tool creates a compilable mutant. Keep the failure attached to `rig-services/testing.mutation.mutant-generator.json`; do not infer that a mutation was generated or killed. mutant generator configuration validation only; declared policy does not prove running mutant generator behavior. Select an approved repository-owned command to verify that behavior.
