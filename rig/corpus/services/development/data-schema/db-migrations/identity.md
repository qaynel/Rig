# development.data-schema.db-migrations — identity

Policy grade: db-migrations owns data-schema.db-migrations. Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Input: `rig-services/development.data-schema.db-migrations.json`. Configuration validation only, so it confirms migration order, rollback steps and the destructive-change flag are declared; it does not show migrations apply or roll back.

Disposition: executable.
Acceptance target: policy:development.data-schema.db-migrations:minimal:db-migrations-source-code-boundary.
Declared predicates: db-migrations-source-code-boundary: `migration_order` is nonempty (a string or array).
