# testing.test-data.synthetic-data — behavior-oracle slice

Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Policy grade slice `synthetic-data-slice-behavior-oracle`: List the rules that keep synthetic records valid for the domain. Rule-free data breaks constraints, so write them. Despite its name this slice is not a behavior oracle: it confirms generation rules, a seed and the customer-records flag are declared; it does not generate data.
