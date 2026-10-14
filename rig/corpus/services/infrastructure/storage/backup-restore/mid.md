# infrastructure.storage.backup-restore — mid

Mid adds repository context for backup restore; it does not widen ownership beyond storage.backup-restore. The context signals are restore_test_schedule.

Start from the existing repository's backup restore convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in storage under their own verdicts.

Acceptance target: fixture:infrastructure.storage.backup-restore:repository-context. Given storage.backup-restore has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent storage concern; fail when the result infers local convention without an inspectable source.
