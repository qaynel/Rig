# testing.mutation.mutant-generator — minimal

Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Grade: minimal. Assurance remains Policy grade. This check rejects a policy with no mutation_operators: the bad fixture has `mutation_operators` = `[]`, while the accepted fixture has `mutation_operators` = `["negate conditional"]`.

A listed operator is only configuration evidence; it does not show that the tool creates a compilable mutant.

Input: `rig-services/testing.mutation.mutant-generator.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: Configuration validation only, so it confirms mutation operators, target paths and the mutate-tests flag are declared; it does not generate mutants.

Acceptance target: policy:testing.mutation.mutant-generator:minimal:mutant-generator-source-code-boundary.

Declared predicates: mutant-generator-source-code-boundary: `mutation_operators` is nonempty (a string or array).

Check: `mutant-generator-source-code-boundary`.
