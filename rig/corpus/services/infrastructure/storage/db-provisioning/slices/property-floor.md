# infrastructure.storage.db-provisioning — property-floor slice

Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Policy grade slice. This slice bounds db provisioning to storage.db-provisioning. It uses `db-provisioning-slice-property-floor` and checks database_version (nonempty): database version must name the concrete repository contract.