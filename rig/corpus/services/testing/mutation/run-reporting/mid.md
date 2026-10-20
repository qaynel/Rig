# testing.mutation.run-reporting — mid

Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: run-reporting-source-code-boundary, run-reporting-mutation-context.

List at least one value for `input_revision`. Bind results to a revision identifier; reports from different source revisions must not be compared as one run.

This remains configuration review. A value in `rig-services/testing.mutation.run-reporting.json` does not prove the command was run, that its output was correct, or that neighboring mutation stages were covered.

Repository-context target (not established by this policy check): policy:testing.mutation.run-reporting:mid:run-reporting-source-code-boundary+run-reporting-mutation-context.

Check: `run-reporting-mutation-context`.
