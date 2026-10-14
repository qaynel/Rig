# infrastructure.storage.backup-restore — property-floor slice

Policy grade slice. This slice bounds backup restore to storage.backup-restore. It uses `backup-restore-slice-property-floor` and checks backup_schedule (nonempty): backup schedule must name the concrete repository contract..

For backup restore, choose a repository example that satisfies backup_schedule at the property-floor floor, plus a failure where backup schedule must name the concrete repository contract. is false. For backup restore, wire `property-floor` to `rig-services/infrastructure.storage.backup-restore.json` and keep its verdict on backup_schedule; missing evidence is a named gap, with ceiling backup restore configuration validation only; declared policy does not prove running backup restore behavior. Choose a repository-owned check that observes backup restore from rig-services/infrastructure.storage.backup-restore.json..

Service-specific evidence cues:
Offer: Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.
minimal: backup schedule — "daily".
mid: restore test schedule — "monthly".
maximal: backup without restore test — false.
