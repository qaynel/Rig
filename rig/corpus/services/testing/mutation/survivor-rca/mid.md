# testing.mutation.survivor-rca — mid

Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: survivor-rca-source-code-boundary, survivor-rca-mutation-context.

List at least one value for `missing_assertions`. Connect each survivor to the assertion that should distinguish the original and mutated behavior.

This remains configuration review. A value in `rig-services/testing.mutation.survivor-rca.json` does not prove the command was run, that its output was correct, or that neighboring mutation stages were covered.

Repository-context target (not established by this policy check): policy:testing.mutation.survivor-rca:mid:survivor-rca-source-code-boundary+survivor-rca-mutation-context.

Check: `survivor-rca-mutation-context`.
