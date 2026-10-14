# infrastructure.disaster-recovery.dr-runbooks — mid

Mid adds repository context for dr runbooks; it does not widen ownership beyond disaster-recovery.dr-runbooks. The context signals are exercise_schedule.

Inspect the existing repository's dr runbooks convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in disaster-recovery under their own verdicts.

Acceptance target: fixture:infrastructure.disaster-recovery.dr-runbooks:repository-context. Given disaster-recovery.dr-runbooks has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent disaster recovery concern; fail when the result infers local convention without an inspectable source.
