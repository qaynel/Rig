# infrastructure.storage.db-provisioning — maximal

Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Policy grade, maximal: Set public database endpoint to false. A publicly reachable database invites attack, so keep it on a private network. Cumulative with minimal and mid. Binding checks: db-provisioning-source-code-boundary, db-provisioning-storage-context, db-provisioning-evidence-receipt.

Acceptance target: policy:infrastructure.storage.db-provisioning:maximal:db-provisioning-source-code-boundary+db-provisioning-storage-context+db-provisioning-evidence-receipt.
Declared predicates: db-provisioning-source-code-boundary: `database_version` is nonempty (a string or array); db-provisioning-storage-context: `access_scope` is nonempty (a string or array); db-provisioning-evidence-receipt: `public_database_endpoint` equals false.
