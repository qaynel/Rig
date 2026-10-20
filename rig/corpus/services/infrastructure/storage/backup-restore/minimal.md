# infrastructure.storage.backup-restore — minimal

Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for backup restore. The minimal boundary for backup restore checks backup_schedule (nonempty): backup schedule must name the concrete repository contract. Binding checks: backup-restore-source-code-boundary.

Use a repository-owned command or existing native check that can observe storage.backup-restore; bind it to the input named in `rig-services/infrastructure.storage.backup-restore.json` and preserve the check's failure status. When adopting this in an existing repository, connect backup restore to the command that inspects backup_schedule and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside storage.backup-restore as a failure.

Acceptance target: policy:infrastructure.storage.backup-restore:minimal:backup-restore-source-code-boundary.

Declared predicates: backup-restore-source-code-boundary: `backup_schedule` is nonempty (a string or array).
