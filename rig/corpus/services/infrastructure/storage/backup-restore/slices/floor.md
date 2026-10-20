# infrastructure.storage.backup-restore — floor and mutation-floor slice

Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.

Policy grade slice `backup-restore-slice-floor`: Declare the backup schedule. Backups that run irregularly leave gaps, so set the cadence.
