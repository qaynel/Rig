# infrastructure.storage.backup-restore — maximal

Maximal adds a replayable evidence receipt for backup restore. The evidence must preserve the backup_schedule, restore_test_schedule, backup_without_restore_test inputs that determined the result.

Trace the verdict to a second run against unchanged backup restore inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: backup restore configuration validation only; declared policy does not prove running backup restore behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.storage.backup-restore:evidence-replay. Given the storage.backup-restore binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
