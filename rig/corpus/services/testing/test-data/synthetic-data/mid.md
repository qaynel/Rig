# testing.test-data.synthetic-data — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for synthetic data; it does not widen ownership beyond test-data.synthetic-data. The context signals are seed. Binding checks: synthetic-data-test-data-context.

Ground the decision in the existing repository's synthetic data convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in test-data under their own verdicts.

Acceptance target: fixture:testing.test-data.synthetic-data:repository-context. Given test-data.synthetic-data has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent test data concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Owned scope: `test-data.synthetic-data`.

Offer: Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Input: `rig-services/testing.test-data.synthetic-data.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: synthetic data configuration validation only; declared policy does not prove running synthetic data behavior. Select an approved repository-owned command to verify that behavior.

minimal: generation rules — ["valid account IDs"].

mid: seed — 42.

maximal: use customer records — false.
