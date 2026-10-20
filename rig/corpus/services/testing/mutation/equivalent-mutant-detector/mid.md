# testing.mutation.equivalent-mutant-detector — mid

Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: equivalent-mutant-detector-source-code-boundary, equivalent-mutant-detector-mutation-context.

List at least one value for `review_owners`. Name a reviewer who can assess the affected behavior and inspect the domain evidence behind the claim.

This remains configuration review. A value in `rig-services/testing.mutation.equivalent-mutant-detector.json` does not prove the command was run, that its output was correct, or that neighboring mutation stages were covered.

Repository-context target (not established by this policy check): policy:testing.mutation.equivalent-mutant-detector:mid:equivalent-mutant-detector-source-code-boundary+equivalent-mutant-detector-mutation-context.

Check: `equivalent-mutant-detector-mutation-context`.
