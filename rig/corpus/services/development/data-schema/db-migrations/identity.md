# development.data-schema.db-migrations — identity

Policy grade: db migrations owns data-schema.db-migrations. Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Keep neighboring data-schema services outside the db migrations decision for data-schema.db-migrations. Use the configured input at `rig-services/development.data-schema.db-migrations.json`; malformed input is still attributed to that path.

Disposition: executable. Start from the limit: db migrations configuration validation only; declared policy does not prove running db migrations behavior. Choose a repository-owned check that observes db migrations from rig-services/development.data-schema.db-migrations.json.

Acceptance target: policy:development.data-schema.db-migrations:minimal:db-migrations-source-code-boundary.

Declared predicates: db-migrations-source-code-boundary: `migration_order` is nonempty (a string or array).
