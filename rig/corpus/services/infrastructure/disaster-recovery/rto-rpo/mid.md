# infrastructure.disaster-recovery.rto-rpo — mid

Mid adds repository context for rto rpo; it does not widen ownership beyond disaster-recovery.rto-rpo. The context signals are rpo_minutes.

Trace the verdict to the existing repository's rto rpo convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in disaster-recovery under their own verdicts.

Acceptance target: fixture:infrastructure.disaster-recovery.rto-rpo:repository-context. Given disaster-recovery.rto-rpo has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent disaster recovery concern; fail when the result infers local convention without an inspectable source.
