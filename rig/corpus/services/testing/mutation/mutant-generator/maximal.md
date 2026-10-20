# testing.mutation.mutant-generator — maximal

Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: mutant-generator-source-code-boundary, mutant-generator-mutation-context, mutant-generator-evidence-receipt.

Keep `mutate_test_code` equal to false. Keep the test-code prohibition in the config; mutation output still needs a real generator run and unchanged test inputs.

Maximal here adds a configuration guard, not an evidence receipt or a demonstrated mutation outcome. mutant generator configuration validation only; declared policy does not prove running mutant generator behavior. Select an approved repository-owned command to verify that behavior.

Evidence-replay target (not established by this policy check): policy:testing.mutation.mutant-generator:maximal:mutant-generator-source-code-boundary+mutant-generator-mutation-context+mutant-generator-evidence-receipt.

Check: `mutant-generator-evidence-receipt`.
