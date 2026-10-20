# development.data-schema.db-migrations — mid

Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Policy grade, mid: Write the rollback steps for a failed migration. Without a tested recovery route a bad migration is permanent, so list the exact reverse steps. Cumulative with minimal. Binding checks: db-migrations-source-code-boundary, db-migrations-data-schema-context.

Acceptance target: policy:development.data-schema.db-migrations:mid:db-migrations-source-code-boundary+db-migrations-data-schema-context.
Declared predicates: db-migrations-source-code-boundary: `migration_order` is nonempty (a string or array); db-migrations-data-schema-context: `rollback_steps` is nonempty (a string or array).
