# testing.mutation.mutant-generator — maximal

Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Policy grade, maximal: Set mutating test code to false. Altering assertions measures the wrong boundary and fabricates scores, so mutate production code only. Cumulative with minimal and mid. Binding checks: mutant-generator-source-code-boundary, mutant-generator-mutation-context, mutant-generator-evidence-receipt.
