# synthetic data

Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Owned scope: `test-data.synthetic-data`.

Offer: Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Input: `rig-services/testing.test-data.synthetic-data.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: synthetic data configuration validation only; declared policy does not prove running synthetic data behavior. Select an approved repository-owned command to verify that behavior.

minimal: generation rules — ["valid account IDs"].

mid: seed — 42.

maximal: use customer records — false.

