# testing.regression.change-impact — identity

Policy grade: change impact owns regression.change-impact. Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Keep neighboring regression services outside the change impact decision for regression.change-impact. Read the configured input at `rig-services/testing.regression.change-impact.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: change impact configuration validation only; declared policy does not prove running change impact behavior. Choose a repository-owned check that observes change impact from rig-services/testing.regression.change-impact.json.

Acceptance target: fixture:testing.regression.change-impact:policy-boundary. Given source-code is present and regression.change-impact is selected, pass only when the repository binding evaluates regression.change-impact and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent regression concern.

Service-specific evidence cues:
Offer: Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.
minimal: changed interfaces — ["order serializer"].
mid: affected suites — ["order contract"].
maximal: select by filename only — false.
