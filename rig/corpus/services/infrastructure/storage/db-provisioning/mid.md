# infrastructure.storage.db-provisioning — mid

Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: db-provisioning-source-code-boundary, db-provisioning-storage-context.

Start from the existing repository's db provisioning convention, then name the source path or command that establishes it. For db provisioning, inspect the repository's actual spec, source, test, or configuration for access_scope; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring storage services outside the db provisioning decision for storage.db-provisioning.

Acceptance target: policy:infrastructure.storage.db-provisioning:mid:db-provisioning-source-code-boundary+db-provisioning-storage-context.

Declared predicates: db-provisioning-source-code-boundary: `database_version` is nonempty (a string or array); db-provisioning-storage-context: `access_scope` is nonempty (a string or array).
