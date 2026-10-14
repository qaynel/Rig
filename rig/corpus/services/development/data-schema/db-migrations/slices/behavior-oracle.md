# development.data-schema.db-migrations — behavior-oracle slice

Policy grade slice. This slice bounds db migrations to data-schema.db-migrations. It uses `db-migrations-slice-behavior-oracle` and checks migration_order (nonempty): migration order must name the concrete repository contract..

For db migrations, choose a repository example that satisfies migration_order at the behavior-oracle floor, plus a failure where migration order must name the concrete repository contract. is false. For db migrations, wire `behavior-oracle` to `rig-services/development.data-schema.db-migrations.json` and keep its verdict on migration_order; missing evidence is a named gap, with ceiling db migrations configuration validation only; declared policy does not prove running db migrations behavior. Choose a repository-owned check that observes db migrations from rig-services/development.data-schema.db-migrations.json..

Service-specific evidence cues:
Offer: Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.
minimal: migration order — ["001_create_items","002_add_owner"].
mid: rollback steps — ["drop owner column"].
maximal: destructive change approved — false.
