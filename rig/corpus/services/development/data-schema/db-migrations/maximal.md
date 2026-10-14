# development.data-schema.db-migrations — maximal

Maximal adds a replayable evidence receipt for db migrations. The evidence must preserve the migration_order, rollback_steps, destructive_change_approved inputs that determined the result.

Inspect a second run against unchanged db migrations inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: db migrations configuration validation only; declared policy does not prove running db migrations behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.data-schema.db-migrations:evidence-replay. Given the data-schema.db-migrations binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
