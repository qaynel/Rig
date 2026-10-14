# testing.test-data.synthetic-data — floor and mutation-floor slice

Policy grade slice. This slice bounds synthetic data to test-data.synthetic-data. It uses `synthetic-data-slice-floor` and checks generation_rules (nonempty): generation rules must name the concrete repository contract..

For synthetic data, choose a repository example that satisfies generation_rules at the floor and mutation-floor floor, plus a failure where generation rules must name the concrete repository contract. is false. For synthetic data, wire `floor and mutation-floor` to `rig-services/testing.test-data.synthetic-data.json` and keep its verdict on generation_rules; missing evidence is a named gap, with ceiling synthetic data configuration validation only; declared policy does not prove running synthetic data behavior. Choose a repository-owned check that observes synthetic data from rig-services/testing.test-data.synthetic-data.json..

Service-specific evidence cues:
Offer: Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.
minimal: generation rules — ["valid account IDs"].
mid: seed — 42.
maximal: use customer records — false.
