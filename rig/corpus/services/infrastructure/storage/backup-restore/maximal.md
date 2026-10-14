# infrastructure.storage.backup-restore — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for backup restore. The evidence must preserve the backup_schedule, restore_test_schedule, backup_without_restore_test inputs that determined the result. Binding checks: backup-restore-evidence-receipt.

Trace the verdict to a second run against unchanged backup restore inputs. Record the backup_schedule, restore_test_schedule, backup_without_restore_test inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this backup restore result is stale. The ceiling remains: backup restore configuration validation only; declared policy does not prove running backup restore behavior. Choose a repository-owned check that observes backup restore from rig-services/infrastructure.storage.backup-restore.json.

Acceptance target: fixture:infrastructure.storage.backup-restore:evidence-replay. Given the storage.backup-restore binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.
minimal: backup schedule — "daily".
mid: restore test schedule — "monthly".
maximal: backup without restore test — false.
