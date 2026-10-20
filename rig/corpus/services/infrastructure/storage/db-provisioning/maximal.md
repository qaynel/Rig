# infrastructure.storage.db-provisioning — maximal

Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: db-provisioning-source-code-boundary, db-provisioning-storage-context, db-provisioning-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:infrastructure.storage.db-provisioning:maximal:db-provisioning-source-code-boundary+db-provisioning-storage-context+db-provisioning-evidence-receipt.

Declared predicates: db-provisioning-source-code-boundary: `database_version` is nonempty (a string or array); db-provisioning-storage-context: `access_scope` is nonempty (a string or array); db-provisioning-evidence-receipt: `public_database_endpoint` equals false.
