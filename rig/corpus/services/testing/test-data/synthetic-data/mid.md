# testing.test-data.synthetic-data — mid

Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: synthetic-data-source-code-boundary, synthetic-data-test-data-context.

Ground the decision in the existing repository's synthetic data convention, then name the source path or command that establishes it. For synthetic data, inspect the repository's actual spec, source, test, or configuration for seed; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring test-data services outside the synthetic data decision for test-data.synthetic-data.

Acceptance target: policy:testing.test-data.synthetic-data:mid:synthetic-data-source-code-boundary+synthetic-data-test-data-context.

Declared predicates: synthetic-data-source-code-boundary: `generation_rules` is nonempty (a string or array); synthetic-data-test-data-context: `seed` is numeric and at least 42.
