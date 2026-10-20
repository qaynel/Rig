# development.data-schema.db-migrations — floor and mutation-floor slice

Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Policy grade slice. This slice bounds db migrations to data-schema.db-migrations. It uses `db-migrations-slice-floor` and checks migration_order (nonempty): migration order must name the concrete repository contract.