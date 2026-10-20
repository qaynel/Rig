# testing.integration.internal-contract — maximal

Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Policy grade, maximal: Set allowing breaking change to false. Breaking a consumer needs a deliberate transition, not a producer-only fixture update. Cumulative with minimal and mid. Binding checks: internal-contract-source-code-boundary, internal-contract-integration-context, internal-contract-evidence-receipt.

Acceptance target: policy:testing.integration.internal-contract:maximal:internal-contract-source-code-boundary+internal-contract-integration-context+internal-contract-evidence-receipt.
Declared predicates: internal-contract-source-code-boundary: `producer_schema` is nonempty (a string or array); internal-contract-integration-context: `consumer_versions` is nonempty (a string or array); internal-contract-evidence-receipt: `allow_breaking_change` equals false.
