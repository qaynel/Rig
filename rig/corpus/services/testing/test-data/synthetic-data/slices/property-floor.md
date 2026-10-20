# testing.test-data.synthetic-data — property-floor slice

Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Policy grade slice. This slice bounds synthetic data to test-data.synthetic-data. It uses `synthetic-data-slice-property-floor` and checks generation_rules (nonempty): generation rules must name the concrete repository contract.