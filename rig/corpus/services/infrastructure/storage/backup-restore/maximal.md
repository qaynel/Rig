# infrastructure.storage.backup-restore — maximal

Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.

Policy grade, maximal: Set backup without a restore test to false. Successful backup creation cannot prove recovery, so require a restore test. Cumulative with minimal and mid. Binding checks: backup-restore-source-code-boundary, backup-restore-storage-context, backup-restore-evidence-receipt.

Acceptance target: policy:infrastructure.storage.backup-restore:maximal:backup-restore-source-code-boundary+backup-restore-storage-context+backup-restore-evidence-receipt.
Declared predicates: backup-restore-source-code-boundary: `backup_schedule` is nonempty (a string or array); backup-restore-storage-context: `restore_test_schedule` is nonempty (a string or array); backup-restore-evidence-receipt: `backup_without_restore_test` equals false.
