# infrastructure.cost.utilization-analysis — mid

Mid adds repository context for utilization analysis; it does not widen ownership beyond cost.utilization-analysis. The context signals are observation_window_days.

Start from the existing repository's utilization analysis convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in cost under their own verdicts.

Acceptance target: fixture:infrastructure.cost.utilization-analysis:repository-context. Given cost.utilization-analysis has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent cost concern; fail when the result infers local convention without an inspectable source.
