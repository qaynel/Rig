# testing.mutation.mutant-generator — minimal

Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Grade: minimal. Assurance remains Policy grade. This check rejects a policy with no mutation_operators: the bad fixture has `mutation_operators` = `[]`, while the accepted fixture has `mutation_operators` = `["negate conditional"]`.

List at least one value for `mutation_operators`. The result says only that the configured operator or input is present. A listed operator is only configuration evidence; it does not show that the tool creates a compilable mutant.

Input: `rig-services/testing.mutation.mutant-generator.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: mutant generator configuration validation only; declared policy does not prove running mutant generator behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: policy:testing.mutation.mutant-generator:minimal:mutant-generator-source-code-boundary.

Declared predicates: mutant-generator-source-code-boundary: `mutation_operators` is nonempty (a string or array).

Check: `mutant-generator-source-code-boundary`.
