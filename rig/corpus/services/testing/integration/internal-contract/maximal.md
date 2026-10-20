# testing.integration.internal-contract — maximal

Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: internal-contract-source-code-boundary, internal-contract-integration-context, internal-contract-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:testing.integration.internal-contract:maximal:internal-contract-source-code-boundary+internal-contract-integration-context+internal-contract-evidence-receipt.

Declared predicates: internal-contract-source-code-boundary: `producer_schema` is nonempty (a string or array); internal-contract-integration-context: `consumer_versions` is nonempty (a string or array); internal-contract-evidence-receipt: `allow_breaking_change` equals false.
