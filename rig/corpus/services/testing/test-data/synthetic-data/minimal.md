# testing.test-data.synthetic-data — minimal

Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for synthetic data. The minimal boundary for synthetic data checks generation_rules (nonempty): generation rules must name the concrete repository contract. Binding checks: synthetic-data-source-code-boundary.

Read a repository-owned command or existing native check that can observe test-data.synthetic-data; bind it to the input named in `rig-services/testing.test-data.synthetic-data.json` and preserve the check's failure status. When adopting this in an existing repository, connect synthetic data to the command that inspects generation_rules and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside test-data.synthetic-data as a failure.

Acceptance target: policy:testing.test-data.synthetic-data:minimal:synthetic-data-source-code-boundary.

Declared predicates: synthetic-data-source-code-boundary: `generation_rules` is nonempty (a string or array).
