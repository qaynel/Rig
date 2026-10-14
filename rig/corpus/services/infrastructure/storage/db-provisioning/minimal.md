# infrastructure.storage.db-provisioning — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for db provisioning. The minimal boundary for db provisioning checks database_version (nonempty): database version must name the concrete repository contract.. Binding checks: db-provisioning-source-code-boundary.

Use a repository-owned command or existing native check that can observe storage.db-provisioning; bind it to the input named in `rig-services/infrastructure.storage.db-provisioning.json` and preserve the check's failure status. When adopting this in an existing repository, connect db provisioning to the command that inspects database_version and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside storage.db-provisioning as a failure.

Acceptance target: fixture:infrastructure.storage.db-provisioning:policy-boundary. Given source-code is present and storage.db-provisioning is selected, pass only when the repository binding evaluates storage.db-provisioning and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent storage concern. The ceiling is db provisioning configuration validation only; declared policy does not prove running db provisioning behavior. Choose a repository-owned check that observes db provisioning from rig-services/infrastructure.storage.db-provisioning.json..

Service-specific evidence cues:
Offer: Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.
minimal: database version — "16".
mid: access scope — "private-network".
maximal: public database endpoint — false.
