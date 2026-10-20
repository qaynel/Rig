# synthetic-data

Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Owned scope: `test-data.synthetic-data`. Input: `rig-services/testing.test-data.synthetic-data.json`.

Coverage ceiling: Configuration validation only, so it confirms generation rules, a seed and the customer-records flag are declared; it does not generate data.

minimal: generation rules — ["valid account IDs"]. List the rules that keep synthetic records valid for the domain. Rule-free data breaks constraints, so write them.

mid: seed — 42. Fix a seed, at least 42 as a value. Deterministic output makes failures reproducible, so record it.

maximal: use customer records — false. Set using customer records to false. Real customer data must not become test data, so generate it instead.
