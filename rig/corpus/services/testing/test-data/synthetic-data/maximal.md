# testing.test-data.synthetic-data — maximal

Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Policy grade, maximal: Set using customer records to false. Real customer data must not become test data, so generate it instead. Cumulative with minimal and mid. Binding checks: synthetic-data-source-code-boundary, synthetic-data-test-data-context, synthetic-data-evidence-receipt.

Acceptance target: policy:testing.test-data.synthetic-data:maximal:synthetic-data-source-code-boundary+synthetic-data-test-data-context+synthetic-data-evidence-receipt.
Declared predicates: synthetic-data-source-code-boundary: `generation_rules` is nonempty (a string or array); synthetic-data-test-data-context: `seed` is numeric and at least 42; synthetic-data-evidence-receipt: `use_customer_records` equals false.
