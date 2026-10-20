# development.data-schema.db-migrations — maximal

Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Policy grade, maximal: Destructive changes must be marked not approved by default. A drop or truncate needs its own explicit approval, so keep this false until a separate sign-off exists. Cumulative with minimal and mid. Binding checks: db-migrations-source-code-boundary, db-migrations-data-schema-context, db-migrations-evidence-receipt.

Acceptance target: policy:development.data-schema.db-migrations:maximal:db-migrations-source-code-boundary+db-migrations-data-schema-context+db-migrations-evidence-receipt.
Declared predicates: db-migrations-source-code-boundary: `migration_order` is nonempty (a string or array); db-migrations-data-schema-context: `rollback_steps` is nonempty (a string or array); db-migrations-evidence-receipt: `destructive_change_approved` equals false.
