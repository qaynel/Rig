# testing.test-data.synthetic-data — maximal

Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: synthetic-data-source-code-boundary, synthetic-data-test-data-context, synthetic-data-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:testing.test-data.synthetic-data:maximal:synthetic-data-source-code-boundary+synthetic-data-test-data-context+synthetic-data-evidence-receipt.

Declared predicates: synthetic-data-source-code-boundary: `generation_rules` is nonempty (a string or array); synthetic-data-test-data-context: `seed` is numeric and at least 42; synthetic-data-evidence-receipt: `use_customer_records` equals false.
