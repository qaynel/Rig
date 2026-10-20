# testing.mutation.remediation-advisor — mid

Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: remediation-advisor-source-code-boundary, remediation-advisor-mutation-context.

List at least one value for `target_behaviors`. Tie each proposed case to the behavior it protects, not to the implementation branch or helper name.

This remains configuration review. A value in `rig-services/testing.mutation.remediation-advisor.json` does not prove the command was run, that its output was correct, or that neighboring mutation stages were covered.

Repository-context target (not established by this policy check): policy:testing.mutation.remediation-advisor:mid:remediation-advisor-source-code-boundary+remediation-advisor-mutation-context.

Check: `remediation-advisor-mutation-context`.
