# testing.test-data.synthetic-data — identity

Policy grade: synthetic data owns test-data.synthetic-data. Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Keep sibling services in test-data under their own verdicts. Inspect the configured input at `rig-services/testing.test-data.synthetic-data.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: synthetic data configuration validation only; declared policy does not prove running synthetic data behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.test-data.synthetic-data:policy-boundary. Given source-code is present and test-data.synthetic-data is selected, pass only when the repository binding evaluates test-data.synthetic-data and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent test data concern.

Service-specific evidence cues:
Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Owned scope: `test-data.synthetic-data`.

Offer: Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Input: `rig-services/testing.test-data.synthetic-data.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: synthetic data configuration validation only; declared policy does not prove running synthetic data behavior. Select an approved repository-owned command to verify that behavior.

minimal: generation rules — ["valid account IDs"].

mid: seed — 42.

maximal: use customer records — false.
