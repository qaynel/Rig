# testing.integration.internal-contract — minimal

Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Policy grade, minimal: Declare the producer schema consumers rely on. Without it compatibility has no reference, so point to the schema file. Binding checks: internal-contract-source-code-boundary.

Acceptance target: policy:testing.integration.internal-contract:minimal:internal-contract-source-code-boundary.
Declared predicates: internal-contract-source-code-boundary: `producer_schema` is nonempty (a string or array).
