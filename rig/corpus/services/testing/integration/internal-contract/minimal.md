# testing.integration.internal-contract — minimal

Minimal establishes a non-vacuous policy boundary for internal contract. It checks producer_schema (nonempty): producer schema must name the concrete repository contract..

Tie acceptance to a repository-owned command or existing native check that can observe integration.internal-contract; bind it to the input named in `rig-services/testing.integration.internal-contract.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside integration.internal-contract is a failure.

Acceptance target: fixture:testing.integration.internal-contract:policy-boundary. Given source-code is present and integration.internal-contract is selected, pass only when the repository binding evaluates integration.internal-contract and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern. A passing policy check does not establish runtime behavior.
