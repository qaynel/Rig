# infrastructure.storage.backup-restore — mid

Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.

Policy grade, mid: Declare how often restores are tested. A backup never restored is unproven, so schedule independent restore tests. Cumulative with minimal. Binding checks: backup-restore-source-code-boundary, backup-restore-storage-context.

Acceptance target: policy:infrastructure.storage.backup-restore:mid:backup-restore-source-code-boundary+backup-restore-storage-context.
Declared predicates: backup-restore-source-code-boundary: `backup_schedule` is nonempty (a string or array); backup-restore-storage-context: `restore_test_schedule` is nonempty (a string or array).
