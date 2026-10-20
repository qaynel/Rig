# testing.integration.internal-contract — identity

Policy grade: internal-contract owns integration.internal-contract. Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Input: `rig-services/testing.integration.internal-contract.json`. Configuration validation only, so it confirms the producer schema, consumer versions and the breaking-change flag are declared; it does not compare live schemas.

Disposition: executable.
Acceptance target: policy:testing.integration.internal-contract:minimal:internal-contract-source-code-boundary.
Declared predicates: internal-contract-source-code-boundary: `producer_schema` is nonempty (a string or array).
