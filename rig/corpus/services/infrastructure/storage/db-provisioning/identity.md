# infrastructure.storage.db-provisioning — identity

Policy grade: db-provisioning owns storage.db-provisioning. Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Input: `rig-services/infrastructure.storage.db-provisioning.json`. Configuration validation only, so it confirms the database version, access scope and the public-endpoint flag are declared; it does not read the managed service.

Disposition: executable.
Acceptance target: policy:infrastructure.storage.db-provisioning:minimal:db-provisioning-source-code-boundary.
Declared predicates: db-provisioning-source-code-boundary: `database_version` is nonempty (a string or array).
