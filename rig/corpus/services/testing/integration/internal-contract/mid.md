# testing.integration.internal-contract — mid

Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: internal-contract-source-code-boundary, internal-contract-integration-context.

Read the existing repository's internal contract convention, then name the source path or command that establishes it. For internal contract, inspect the repository's actual spec, source, test, or configuration for consumer_versions; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring integration services outside the internal contract decision for integration.internal-contract.

Acceptance target: policy:testing.integration.internal-contract:mid:internal-contract-source-code-boundary+internal-contract-integration-context.

Declared predicates: internal-contract-source-code-boundary: `producer_schema` is nonempty (a string or array); internal-contract-integration-context: `consumer_versions` is nonempty (a string or array).
