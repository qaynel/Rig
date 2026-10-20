# development.data-schema.db-migrations — behavior-oracle slice

Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Policy grade slice. This slice bounds db migrations to data-schema.db-migrations. It uses `db-migrations-slice-behavior-oracle` and checks migration_order (nonempty): migration order must name the concrete repository contract.