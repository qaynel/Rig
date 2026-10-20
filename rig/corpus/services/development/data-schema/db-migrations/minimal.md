# development.data-schema.db-migrations — minimal

Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for db migrations. The minimal boundary for db migrations checks migration_order (nonempty): migration order must name the concrete repository contract. Binding checks: db-migrations-source-code-boundary.

Acceptance target: policy:development.data-schema.db-migrations:minimal:db-migrations-source-code-boundary.

Declared predicates: db-migrations-source-code-boundary: `migration_order` is nonempty (a string or array).
