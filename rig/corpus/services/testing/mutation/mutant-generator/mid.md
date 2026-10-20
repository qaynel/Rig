# testing.mutation.mutant-generator — mid

Generate semantic changes in the selected production code and leave the tests unchanged. Mutating test assertions measures the wrong boundary and can fabricate useful-looking scores.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: mutant-generator-source-code-boundary, mutant-generator-mutation-context.

List at least one value for `target_paths`. Review target paths against the repository source layout so generated edits stay inside the intended product code.

This remains configuration review. A value in `rig-services/testing.mutation.mutant-generator.json` does not prove the command was run, that its output was correct, or that neighboring mutation stages were covered.

Repository-context target (not established by this policy check): policy:testing.mutation.mutant-generator:mid:mutant-generator-source-code-boundary+mutant-generator-mutation-context.

Check: `mutant-generator-mutation-context`.
