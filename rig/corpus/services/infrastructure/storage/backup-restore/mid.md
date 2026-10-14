# infrastructure.storage.backup-restore — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for backup restore; it does not widen ownership beyond storage.backup-restore. The context signals are restore_test_schedule. Binding checks: backup-restore-storage-context.

Start from the existing repository's backup restore convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in storage under their own verdicts.

Acceptance target: fixture:infrastructure.storage.backup-restore:repository-context. Given storage.backup-restore has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent storage concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.

Owned scope: `storage.backup-restore`.

Offer: Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.

Input: `rig-services/infrastructure.storage.backup-restore.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: backup restore configuration validation only; declared policy does not prove running backup restore behavior. Select an approved repository-owned command to verify that behavior.

minimal: backup schedule — "daily".

mid: restore test schedule — "monthly".

maximal: backup without restore test — false.
