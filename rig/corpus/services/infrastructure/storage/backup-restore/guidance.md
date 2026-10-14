# backup restore

Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.

Owned scope: `storage.backup-restore`.

Offer: Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.

Input: `rig-services/infrastructure.storage.backup-restore.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: backup restore configuration validation only; declared policy does not prove running backup restore behavior. Select an approved repository-owned command to verify that behavior.

minimal: backup schedule — "daily".

mid: restore test schedule — "monthly".

maximal: backup without restore test — false.

