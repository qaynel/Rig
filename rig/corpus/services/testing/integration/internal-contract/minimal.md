# testing.integration.internal-contract — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for internal contract. The minimal boundary for internal contract checks producer_schema (nonempty): producer schema must name the concrete repository contract.. Binding checks: internal-contract-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe integration.internal-contract; bind it to the input named in `rig-services/testing.integration.internal-contract.json` and preserve the check's failure status. When adopting this in an existing repository, connect internal contract to the command that inspects producer_schema and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside integration.internal-contract as a failure.

Acceptance target: fixture:testing.integration.internal-contract:policy-boundary. Given source-code is present and integration.internal-contract is selected, pass only when the repository binding evaluates integration.internal-contract and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern. The ceiling is internal contract configuration validation only; declared policy does not prove running internal contract behavior. Choose a repository-owned check that observes internal contract from rig-services/testing.integration.internal-contract.json..

Service-specific evidence cues:
Offer: Verify producer and consumer compatibility against the same schema. Breaking a consumer contract needs a deliberate transition rather than updating only the producer fixture.
minimal: producer schema — "schemas/order.json".
mid: consumer versions — ["v1","v2"].
maximal: allow breaking change — false.
