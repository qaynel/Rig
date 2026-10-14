# testing.test-data.synthetic-data — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for synthetic data. It checks generation_rules (nonempty): generation rules must name the concrete repository contract.. Binding checks: synthetic-data-source-code-boundary.

Read a repository-owned command or existing native check that can observe test-data.synthetic-data; bind it to the input named in `rig-services/testing.test-data.synthetic-data.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside test-data.synthetic-data is a failure.

Acceptance target: fixture:testing.test-data.synthetic-data:policy-boundary. Given source-code is present and test-data.synthetic-data is selected, pass only when the repository binding evaluates test-data.synthetic-data and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent test data concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Owned scope: `test-data.synthetic-data`.

Offer: Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Input: `rig-services/testing.test-data.synthetic-data.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: synthetic data configuration validation only; declared policy does not prove running synthetic data behavior. Select an approved repository-owned command to verify that behavior.

minimal: generation rules — ["valid account IDs"].

mid: seed — 42.

maximal: use customer records — false.
