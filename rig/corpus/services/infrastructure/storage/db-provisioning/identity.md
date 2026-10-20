# infrastructure.storage.db-provisioning — identity

Policy grade: db provisioning owns storage.db-provisioning. Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Keep neighboring storage services outside the db provisioning decision for storage.db-provisioning. Read the configured input at `rig-services/infrastructure.storage.db-provisioning.json`; malformed input is still attributed to that path.

Disposition: executable. Ground the decision in the limit: db provisioning configuration validation only; declared policy does not prove running db provisioning behavior. Choose a repository-owned check that observes db provisioning from rig-services/infrastructure.storage.db-provisioning.json.

Acceptance target: policy:infrastructure.storage.db-provisioning:minimal:db-provisioning-source-code-boundary.

Declared predicates: db-provisioning-source-code-boundary: `database_version` is nonempty (a string or array).
