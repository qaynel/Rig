# testing.test-data.synthetic-data — property-floor slice

Policy grade slice. This slice bounds synthetic data to test-data.synthetic-data. It uses `synthetic-data-slice-property-floor` and checks generation_rules (nonempty): generation rules must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.test-data.synthetic-data.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than synthetic data configuration validation only; declared policy does not prove running synthetic data behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Owned scope: `test-data.synthetic-data`.

Offer: Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Input: `rig-services/testing.test-data.synthetic-data.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: synthetic data configuration validation only; declared policy does not prove running synthetic data behavior. Select an approved repository-owned command to verify that behavior.

minimal: generation rules — ["valid account IDs"].

mid: seed — 42.

maximal: use customer records — false.
