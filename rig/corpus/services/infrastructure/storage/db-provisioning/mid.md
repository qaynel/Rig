# infrastructure.storage.db-provisioning — mid

Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Policy grade, mid: Restrict access to the intended clients, such as a private network or named roles. Open access exposes data, so declare the scope. Cumulative with minimal. Binding checks: db-provisioning-source-code-boundary, db-provisioning-storage-context.

Acceptance target: policy:infrastructure.storage.db-provisioning:mid:db-provisioning-source-code-boundary+db-provisioning-storage-context.
Declared predicates: db-provisioning-source-code-boundary: `database_version` is nonempty (a string or array); db-provisioning-storage-context: `access_scope` is nonempty (a string or array).
