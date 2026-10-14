# testing.regression.change-impact — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for change impact. It checks changed_interfaces (nonempty): changed interfaces must name the concrete repository contract.. Binding checks: change-impact-source-code-boundary.

Use a repository-owned command or existing native check that can observe regression.change-impact; bind it to the input named in `rig-services/testing.regression.change-impact.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside regression.change-impact is a failure.

Acceptance target: fixture:testing.regression.change-impact:policy-boundary. Given source-code is present and regression.change-impact is selected, pass only when the repository binding evaluates regression.change-impact and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent regression concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Owned scope: `regression.change-impact`.

Offer: Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Input: `rig-services/testing.regression.change-impact.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: change impact configuration validation only; declared policy does not prove running change impact behavior. Select an approved repository-owned command to verify that behavior.

minimal: changed interfaces — ["order serializer"].

mid: affected suites — ["order contract"].

maximal: select by filename only — false.
