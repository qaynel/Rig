# backup-restore

Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.

Owned scope: `storage.backup-restore`. Input: `rig-services/infrastructure.storage.backup-restore.json`.

Coverage ceiling: Configuration validation only, so it confirms a backup schedule, a restore-test schedule and the untested-backup flag are declared; it does not show data is recoverable.

minimal: backup schedule — "daily". Declare the backup schedule. Backups that run irregularly leave gaps, so set the cadence.

mid: restore test schedule — "monthly". Declare how often restores are tested. A backup never restored is unproven, so schedule independent restore tests.

maximal: backup without restore test — false. Set backup without a restore test to false. Successful backup creation cannot prove recovery, so require a restore test.
