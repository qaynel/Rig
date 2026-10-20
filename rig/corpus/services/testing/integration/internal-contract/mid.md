# testing.integration.internal-contract — mid

Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Policy grade, mid: List the consumer versions that must keep working. An empty list ignores existing callers, so name each version. Cumulative with minimal. Binding checks: internal-contract-source-code-boundary, internal-contract-integration-context.

Acceptance target: policy:testing.integration.internal-contract:mid:internal-contract-source-code-boundary+internal-contract-integration-context.
Declared predicates: internal-contract-source-code-boundary: `producer_schema` is nonempty (a string or array); internal-contract-integration-context: `consumer_versions` is nonempty (a string or array).
