# testing.test-data.synthetic-data — minimal

Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Policy grade, minimal: List the rules that keep synthetic records valid for the domain. Rule-free data breaks constraints, so write them. Binding checks: synthetic-data-source-code-boundary.

Acceptance target: policy:testing.test-data.synthetic-data:minimal:synthetic-data-source-code-boundary.
Declared predicates: synthetic-data-source-code-boundary: `generation_rules` is nonempty (a string or array).
