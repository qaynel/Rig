# development.data-schema.db-migrations — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for db migrations. The evidence must preserve the migration_order, rollback_steps, destructive_change_approved inputs that determined the result. Binding checks: db-migrations-evidence-receipt.

Inspect a second run against unchanged db migrations inputs. Record the migration_order, rollback_steps, destructive_change_approved inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this db migrations result is stale. The ceiling remains: db migrations configuration validation only; declared policy does not prove running db migrations behavior. Choose a repository-owned check that observes db migrations from rig-services/development.data-schema.db-migrations.json.

Acceptance target: fixture:development.data-schema.db-migrations:evidence-replay. Given the data-schema.db-migrations binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.
minimal: migration order — ["001_create_items","002_add_owner"].
mid: rollback steps — ["drop owner column"].
maximal: destructive change approved — false.
