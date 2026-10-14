# development.data-schema.db-migrations — floor and mutation-floor slice

This slice bounds db migrations to data-schema.db-migrations. It uses `db-migrations-slice-floor` and checks migration_order (nonempty): migration order must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.data-schema.db-migrations.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than db migrations configuration validation only; declared policy does not prove running db migrations behavior. Select an approved repository-owned command to verify that behavior.
