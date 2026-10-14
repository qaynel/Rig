# infrastructure.observability.alerting — mid

Mid adds repository context for alerting; it does not widen ownership beyond observability.alerting. The context signals are runbook_path.

Ground the decision in the existing repository's alerting convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in observability under their own verdicts.

Acceptance target: fixture:infrastructure.observability.alerting:repository-context. Given observability.alerting has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent observability concern; fail when the result infers local convention without an inspectable source.
