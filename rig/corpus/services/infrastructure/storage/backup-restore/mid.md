# infrastructure.storage.backup-restore — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for backup restore; it does not widen ownership beyond storage.backup-restore. For backup restore, inspect these context signals: restore_test_schedule. Binding checks: backup-restore-storage-context.

Start from the existing repository's backup restore convention, then name the source path or command that establishes it. For backup restore, inspect the repository's actual spec, source, test, or configuration for restore_test_schedule; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring storage services outside the backup restore decision for storage.backup-restore.

Acceptance target: fixture:infrastructure.storage.backup-restore:repository-context. Given storage.backup-restore has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent storage concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.
minimal: backup schedule — "daily".
mid: restore test schedule — "monthly".
maximal: backup without restore test — false.
