# infrastructure.storage.backup-restore — floor and mutation-floor slice

This slice bounds backup restore to storage.backup-restore. It uses `backup-restore-slice-floor` and checks backup_schedule (nonempty): backup schedule must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.storage.backup-restore.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than backup restore configuration validation only; declared policy does not prove running backup restore behavior. Select an approved repository-owned command to verify that behavior.
