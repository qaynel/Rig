# infrastructure.storage.db-provisioning — floor and mutation-floor slice

This slice bounds db provisioning to storage.db-provisioning. It uses `db-provisioning-slice-floor` and checks database_version (nonempty): database version must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.storage.db-provisioning.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than db provisioning configuration validation only; declared policy does not prove running db provisioning behavior. Select an approved repository-owned command to verify that behavior.
