# infrastructure.environment-config.config-drift — mid

Mid adds repository context for config drift; it does not widen ownership beyond environment-config.config-drift. The context signals are comparison_schedule.

Inspect the existing repository's config drift convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in environment-config under their own verdicts.

Acceptance target: fixture:infrastructure.environment-config.config-drift:repository-context. Given environment-config.config-drift has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent environment config concern; fail when the result infers local convention without an inspectable source.
