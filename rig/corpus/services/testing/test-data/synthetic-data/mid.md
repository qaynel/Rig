# testing.test-data.synthetic-data — mid

Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Policy grade, mid: Fix a seed, at least 42 as a value. Deterministic output makes failures reproducible, so record it. Cumulative with minimal. Binding checks: synthetic-data-source-code-boundary, synthetic-data-test-data-context.

Acceptance target: policy:testing.test-data.synthetic-data:mid:synthetic-data-source-code-boundary+synthetic-data-test-data-context.
Declared predicates: synthetic-data-source-code-boundary: `generation_rules` is nonempty (a string or array); synthetic-data-test-data-context: `seed` is numeric and at least 42.
