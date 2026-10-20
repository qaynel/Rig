# development.data-schema.db-migrations — minimal

Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Policy grade, minimal: State the migration order explicitly. Nondeterministic ordering can corrupt a schema, so declare the sequence or numbering the tool follows. Binding checks: db-migrations-source-code-boundary.

Acceptance target: policy:development.data-schema.db-migrations:minimal:db-migrations-source-code-boundary.
Declared predicates: db-migrations-source-code-boundary: `migration_order` is nonempty (a string or array).
