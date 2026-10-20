# infrastructure.storage.db-provisioning — floor and mutation-floor slice

Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Policy grade slice `db-provisioning-slice-floor`: Pin the database engine version. An unpinned engine upgrades unexpectedly, so record the exact version.
