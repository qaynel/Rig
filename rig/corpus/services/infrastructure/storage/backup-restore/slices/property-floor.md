# infrastructure.storage.backup-restore — property-floor slice

Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.

Policy grade slice. This slice bounds backup restore to storage.backup-restore. It uses `backup-restore-slice-property-floor` and checks backup_schedule (nonempty): backup schedule must name the concrete repository contract.