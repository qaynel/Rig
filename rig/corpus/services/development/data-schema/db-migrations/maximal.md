# development.data-schema.db-migrations — maximal

Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: db-migrations-source-code-boundary, db-migrations-data-schema-context, db-migrations-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:development.data-schema.db-migrations:maximal:db-migrations-source-code-boundary+db-migrations-data-schema-context+db-migrations-evidence-receipt.

Declared predicates: db-migrations-source-code-boundary: `migration_order` is nonempty (a string or array); db-migrations-data-schema-context: `rollback_steps` is nonempty (a string or array); db-migrations-evidence-receipt: `destructive_change_approved` equals false.
