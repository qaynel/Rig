# development.data-schema.db-migrations — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for db migrations. The evidence must preserve the migration_order, rollback_steps, destructive_change_approved inputs that determined the result. Binding checks: db-migrations-evidence-receipt.

Inspect a second run against unchanged db migrations inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: db migrations configuration validation only; declared policy does not prove running db migrations behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.data-schema.db-migrations:evidence-replay. Given the data-schema.db-migrations binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Owned scope: `data-schema.db-migrations`.

Offer: Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Input: `rig-services/development.data-schema.db-migrations.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: db migrations configuration validation only; declared policy does not prove running db migrations behavior. Select an approved repository-owned command to verify that behavior.

minimal: migration order — ["001_create_items","002_add_owner"].

mid: rollback steps — ["drop owner column"].

maximal: destructive change approved — false.
