# infrastructure.storage.backup-restore — minimal

Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.

Policy grade, minimal: Declare the backup schedule. Backups that run irregularly leave gaps, so set the cadence. Binding checks: backup-restore-source-code-boundary.

Acceptance target: policy:infrastructure.storage.backup-restore:minimal:backup-restore-source-code-boundary.
Declared predicates: backup-restore-source-code-boundary: `backup_schedule` is nonempty (a string or array).
