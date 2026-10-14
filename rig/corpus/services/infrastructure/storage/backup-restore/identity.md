# infrastructure.storage.backup-restore — identity

Policy grade: backup restore owns storage.backup-restore. Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.

Keep neighboring storage services outside the backup restore decision for storage.backup-restore. Read the configured input at `rig-services/infrastructure.storage.backup-restore.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: backup restore configuration validation only; declared policy does not prove running backup restore behavior. Choose a repository-owned check that observes backup restore from rig-services/infrastructure.storage.backup-restore.json.

Acceptance target: fixture:infrastructure.storage.backup-restore:policy-boundary. Given source-code is present and storage.backup-restore is selected, pass only when the repository binding evaluates storage.backup-restore and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent storage concern.

Service-specific evidence cues:
Offer: Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.
minimal: backup schedule — "daily".
mid: restore test schedule — "monthly".
maximal: backup without restore test — false.
