# testing.integration.internal-contract — minimal

Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for internal contract. The minimal boundary for internal contract checks producer_schema (nonempty): producer schema must name the concrete repository contract. Binding checks: internal-contract-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe integration.internal-contract; bind it to the input named in `rig-services/testing.integration.internal-contract.json` and preserve the check's failure status. When adopting this in an existing repository, connect internal contract to the command that inspects producer_schema and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside integration.internal-contract as a failure.

Acceptance target: policy:testing.integration.internal-contract:minimal:internal-contract-source-code-boundary.

Declared predicates: internal-contract-source-code-boundary: `producer_schema` is nonempty (a string or array).
