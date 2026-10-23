# development.data-schema.db-migrations — property-floor slice

Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Policy grade slice `db-migrations-slice-property-floor`: State the migration order explicitly. Nondeterministic ordering can corrupt a schema, so declare the sequence or numbering the tool follows.
