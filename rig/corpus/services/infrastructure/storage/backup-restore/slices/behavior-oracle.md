# infrastructure.storage.backup-restore — behavior-oracle slice

Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.

Policy grade slice `backup-restore-slice-behavior-oracle`: Declare the backup schedule. Backups that run irregularly leave gaps, so set the cadence. Despite its name this slice is not a behavior oracle: it confirms a backup schedule, a restore-test schedule and the untested-backup flag are declared; it does not show data is recoverable.
