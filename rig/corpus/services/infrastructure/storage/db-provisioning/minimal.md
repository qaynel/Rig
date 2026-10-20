# infrastructure.storage.db-provisioning — minimal

Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for db provisioning. The minimal boundary for db provisioning checks database_version (nonempty): database version must name the concrete repository contract. Binding checks: db-provisioning-source-code-boundary.

Use a repository-owned command or existing native check that can observe storage.db-provisioning; bind it to the input named in `rig-services/infrastructure.storage.db-provisioning.json` and preserve the check's failure status. When adopting this in an existing repository, connect db provisioning to the command that inspects database_version and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside storage.db-provisioning as a failure.

Acceptance target: policy:infrastructure.storage.db-provisioning:minimal:db-provisioning-source-code-boundary.

Declared predicates: db-provisioning-source-code-boundary: `database_version` is nonempty (a string or array).
