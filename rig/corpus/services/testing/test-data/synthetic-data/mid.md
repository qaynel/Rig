# testing.test-data.synthetic-data — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for synthetic data; it does not widen ownership beyond test-data.synthetic-data. For synthetic data, inspect these context signals: seed. Binding checks: synthetic-data-test-data-context.

Ground the decision in the existing repository's synthetic data convention, then name the source path or command that establishes it. For synthetic data, inspect the repository's actual spec, source, test, or configuration for seed; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring test-data services outside the synthetic data decision for test-data.synthetic-data.

Acceptance target: fixture:testing.test-data.synthetic-data:repository-context. Given test-data.synthetic-data has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent test data concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.
minimal: generation rules — ["valid account IDs"].
mid: seed — 42.
maximal: use customer records — false.
