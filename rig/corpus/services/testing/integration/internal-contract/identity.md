# testing.integration.internal-contract — identity

Policy grade: internal contract owns integration.internal-contract. Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Keep neighboring integration services outside the internal contract decision for integration.internal-contract. Anchor the review on the configured input at `rig-services/testing.integration.internal-contract.json`; malformed input is still attributed to that path.

Disposition: executable. Inspect the limit: internal contract configuration validation only; declared policy does not prove running internal contract behavior. Choose a repository-owned check that observes internal contract from rig-services/testing.integration.internal-contract.json.

Acceptance target: policy:testing.integration.internal-contract:minimal:internal-contract-source-code-boundary.

Declared predicates: internal-contract-source-code-boundary: `producer_schema` is nonempty (a string or array).
