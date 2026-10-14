# infrastructure.environment-config.feature-flags — mid

Mid adds repository context for feature flags; it does not widen ownership beyond environment-config.feature-flags. The context signals are rollback_owner.

Inspect the existing repository's feature flags convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in environment-config under their own verdicts.

Acceptance target: fixture:infrastructure.environment-config.feature-flags:repository-context. Given environment-config.feature-flags has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent environment config concern; fail when the result infers local convention without an inspectable source.
