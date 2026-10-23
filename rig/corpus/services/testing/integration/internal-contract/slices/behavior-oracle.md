# testing.integration.internal-contract — behavior-oracle slice

Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Policy grade slice `internal-contract-slice-behavior-oracle`: Declare the producer schema consumers rely on. Without it compatibility has no reference, so point to the schema file. Despite its name this slice is not a behavior oracle: it confirms the producer schema, consumer versions and the breaking-change flag are declared; it does not compare live schemas.
