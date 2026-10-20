# testing.regression.change-impact — minimal

Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for change impact. The minimal boundary for change impact checks changed_interfaces (nonempty): changed interfaces must name the concrete repository contract. Binding checks: change-impact-source-code-boundary.

Use a repository-owned command or existing native check that can observe regression.change-impact; bind it to the input named in `rig-services/testing.regression.change-impact.json` and preserve the check's failure status. When adopting this in an existing repository, connect change impact to the command that inspects changed_interfaces and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside regression.change-impact as a failure.

Acceptance target: policy:testing.regression.change-impact:minimal:change-impact-source-code-boundary.

Declared predicates: change-impact-source-code-boundary: `changed_interfaces` is nonempty (a string or array).
