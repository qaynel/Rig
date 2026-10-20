# infrastructure.storage.backup-restore — mid

Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: backup-restore-source-code-boundary, backup-restore-storage-context.

Start from the existing repository's backup restore convention, then name the source path or command that establishes it. For backup restore, inspect the repository's actual spec, source, test, or configuration for restore_test_schedule; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring storage services outside the backup restore decision for storage.backup-restore.

Acceptance target: policy:infrastructure.storage.backup-restore:mid:backup-restore-source-code-boundary+backup-restore-storage-context.

Declared predicates: backup-restore-source-code-boundary: `backup_schedule` is nonempty (a string or array); backup-restore-storage-context: `restore_test_schedule` is nonempty (a string or array).
