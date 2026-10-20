# infrastructure.storage.backup-restore — identity

Policy grade: backup restore owns storage.backup-restore. Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.

Keep neighboring storage services outside the backup restore decision for storage.backup-restore. Read the configured input at `rig-services/infrastructure.storage.backup-restore.json`; malformed input is still attributed to that path.

Disposition: executable. Ground the decision in the limit: backup restore configuration validation only; declared policy does not prove running backup restore behavior. Choose a repository-owned check that observes backup restore from rig-services/infrastructure.storage.backup-restore.json.

Acceptance target: policy:infrastructure.storage.backup-restore:minimal:backup-restore-source-code-boundary.

Declared predicates: backup-restore-source-code-boundary: `backup_schedule` is nonempty (a string or array).
