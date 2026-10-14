# infrastructure.storage.backup-restore — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for backup restore. The minimal boundary for backup restore checks backup_schedule (nonempty): backup schedule must name the concrete repository contract.. Binding checks: backup-restore-source-code-boundary.

Use a repository-owned command or existing native check that can observe storage.backup-restore; bind it to the input named in `rig-services/infrastructure.storage.backup-restore.json` and preserve the check's failure status. When adopting this in an existing repository, connect backup restore to the command that inspects backup_schedule and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside storage.backup-restore as a failure.

Acceptance target: fixture:infrastructure.storage.backup-restore:policy-boundary. Given source-code is present and storage.backup-restore is selected, pass only when the repository binding evaluates storage.backup-restore and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent storage concern. The ceiling is backup restore configuration validation only; declared policy does not prove running backup restore behavior. Choose a repository-owned check that observes backup restore from rig-services/infrastructure.storage.backup-restore.json..

Service-specific evidence cues:
Offer: Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.
minimal: backup schedule — "daily".
mid: restore test schedule — "monthly".
maximal: backup without restore test — false.
