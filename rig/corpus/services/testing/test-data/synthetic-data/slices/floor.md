# testing.test-data.synthetic-data — floor and mutation-floor slice

Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Policy grade slice `synthetic-data-slice-floor`: List the rules that keep synthetic records valid for the domain. Rule-free data breaks constraints, so write them.
