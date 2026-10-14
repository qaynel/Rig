# testing.regression.change-impact — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for change impact. The minimal boundary for change impact checks changed_interfaces (nonempty): changed interfaces must name the concrete repository contract.. Binding checks: change-impact-source-code-boundary.

Use a repository-owned command or existing native check that can observe regression.change-impact; bind it to the input named in `rig-services/testing.regression.change-impact.json` and preserve the check's failure status. When adopting this in an existing repository, connect change impact to the command that inspects changed_interfaces and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside regression.change-impact as a failure.

Acceptance target: fixture:testing.regression.change-impact:policy-boundary. Given source-code is present and regression.change-impact is selected, pass only when the repository binding evaluates regression.change-impact and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent regression concern. The ceiling is change impact configuration validation only; declared policy does not prove running change impact behavior. Choose a repository-owned check that observes change impact from rig-services/testing.regression.change-impact.json..

Service-specific evidence cues:
Offer: Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.
minimal: changed interfaces — ["order serializer"].
mid: affected suites — ["order contract"].
maximal: select by filename only — false.
