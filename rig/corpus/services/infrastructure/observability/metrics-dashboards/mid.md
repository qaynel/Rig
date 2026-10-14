# infrastructure.observability.metrics-dashboards — mid

Mid adds repository context for metrics dashboards; it does not widen ownership beyond observability.metrics-dashboards. The context signals are dashboard_owner.

Ground the decision in the existing repository's metrics dashboards convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in observability under their own verdicts.

Acceptance target: fixture:infrastructure.observability.metrics-dashboards:repository-context. Given observability.metrics-dashboards has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent observability concern; fail when the result infers local convention without an inspectable source.
