# development.data-schema.db-migrations — mid

Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: db-migrations-source-code-boundary, db-migrations-data-schema-context.

Acceptance target: policy:development.data-schema.db-migrations:mid:db-migrations-source-code-boundary+db-migrations-data-schema-context.

Declared predicates: db-migrations-source-code-boundary: `migration_order` is nonempty (a string or array); db-migrations-data-schema-context: `rollback_steps` is nonempty (a string or array).
