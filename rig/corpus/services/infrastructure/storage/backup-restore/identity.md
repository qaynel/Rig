# infrastructure.storage.backup-restore — identity

Policy grade: backup-restore owns storage.backup-restore. Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.

Input: `rig-services/infrastructure.storage.backup-restore.json`. Configuration validation only, so it confirms a backup schedule, a restore-test schedule and the untested-backup flag are declared; it does not show data is recoverable.

Disposition: executable.
Acceptance target: policy:infrastructure.storage.backup-restore:minimal:backup-restore-source-code-boundary.
Declared predicates: backup-restore-source-code-boundary: `backup_schedule` is nonempty (a string or array).
