# infrastructure.storage.db-provisioning — behavior-oracle slice

Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Policy grade slice `db-provisioning-slice-behavior-oracle`: Pin the database engine version. An unpinned engine upgrades unexpectedly, so record the exact version. Despite its name this slice is not a behavior oracle: it confirms the database version, access scope and the public-endpoint flag are declared; it does not read the managed service.
