# infrastructure.storage.backup-restore — minimal

Minimal establishes a non-vacuous policy boundary for backup restore. It checks backup_schedule (nonempty): backup schedule must name the concrete repository contract..

Use a repository-owned command or existing native check that can observe storage.backup-restore; bind it to the input named in `rig-services/infrastructure.storage.backup-restore.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside storage.backup-restore is a failure.

Acceptance target: fixture:infrastructure.storage.backup-restore:policy-boundary. Given source-code is present and storage.backup-restore is selected, pass only when the repository binding evaluates storage.backup-restore and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent storage concern. A passing policy check does not establish runtime behavior.
