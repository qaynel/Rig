# development.dependency-management.upgrades-migration — maximal

Maximal adds a replayable evidence receipt for upgrades migration. The evidence must preserve the target_versions, migration_steps, rollback_available inputs that determined the result.

Trace the verdict to a second run against unchanged upgrades migration inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: upgrades migration configuration validation only; declared policy does not prove running upgrades migration behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.dependency-management.upgrades-migration:evidence-replay. Given the dependency-management.upgrades-migration binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
