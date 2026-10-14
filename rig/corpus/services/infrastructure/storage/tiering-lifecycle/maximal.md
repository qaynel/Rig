# infrastructure.storage.tiering-lifecycle — maximal

Maximal adds a replayable evidence receipt for tiering lifecycle. The evidence must preserve the storage_classes, retention_days, delete_before_retention inputs that determined the result.

Read a second run against unchanged tiering lifecycle inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: tiering lifecycle configuration validation only; declared policy does not prove running tiering lifecycle behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.storage.tiering-lifecycle:evidence-replay. Given the storage.tiering-lifecycle binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
