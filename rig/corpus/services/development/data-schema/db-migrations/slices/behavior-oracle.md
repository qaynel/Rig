# development.data-schema.db-migrations — behavior-oracle slice

Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Policy grade slice `db-migrations-slice-behavior-oracle`: State the migration order explicitly. Nondeterministic ordering can corrupt a schema, so declare the sequence or numbering the tool follows. Despite its name this slice is not a behavior oracle: it confirms migration order, rollback steps and the destructive-change flag are declared; it does not show migrations apply or roll back.
