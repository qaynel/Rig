# infrastructure.storage.db-provisioning — minimal

Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Policy grade, minimal: Pin the database engine version. An unpinned engine upgrades unexpectedly, so record the exact version. Binding checks: db-provisioning-source-code-boundary.

Acceptance target: policy:infrastructure.storage.db-provisioning:minimal:db-provisioning-source-code-boundary.
Declared predicates: db-provisioning-source-code-boundary: `database_version` is nonempty (a string or array).
