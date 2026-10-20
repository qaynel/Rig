# testing.regression.change-impact — identity

Policy grade: change impact owns regression.change-impact. Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Keep neighboring regression services outside the change impact decision for regression.change-impact. Read the configured input at `rig-services/testing.regression.change-impact.json`; malformed input is still attributed to that path.

Disposition: executable. Ground the decision in the limit: change impact configuration validation only; declared policy does not prove running change impact behavior. Choose a repository-owned check that observes change impact from rig-services/testing.regression.change-impact.json.

Acceptance target: policy:testing.regression.change-impact:minimal:change-impact-source-code-boundary.

Declared predicates: change-impact-source-code-boundary: `changed_interfaces` is nonempty (a string or array).
