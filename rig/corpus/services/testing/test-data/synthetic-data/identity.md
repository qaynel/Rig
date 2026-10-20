# testing.test-data.synthetic-data — identity

Policy grade: synthetic-data owns test-data.synthetic-data. Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Input: `rig-services/testing.test-data.synthetic-data.json`. Configuration validation only, so it confirms generation rules, a seed and the customer-records flag are declared; it does not generate data.

Disposition: executable.
Acceptance target: policy:testing.test-data.synthetic-data:minimal:synthetic-data-source-code-boundary.
Declared predicates: synthetic-data-source-code-boundary: `generation_rules` is nonempty (a string or array).
