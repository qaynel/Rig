# development.data-schema.db-migrations — behavior-oracle slice

Policy grade slice. This slice bounds db migrations to data-schema.db-migrations. It uses `db-migrations-slice-behavior-oracle` and checks migration_order (nonempty): migration order must name the concrete repository contract..

Read a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.data-schema.db-migrations.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than db migrations configuration validation only; declared policy does not prove running db migrations behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Owned scope: `data-schema.db-migrations`.

Offer: Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Input: `rig-services/development.data-schema.db-migrations.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: db migrations configuration validation only; declared policy does not prove running db migrations behavior. Select an approved repository-owned command to verify that behavior.

minimal: migration order — ["001_create_items","002_add_owner"].

mid: rollback steps — ["drop owner column"].

maximal: destructive change approved — false.
