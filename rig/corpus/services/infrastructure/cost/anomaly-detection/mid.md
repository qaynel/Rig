# infrastructure.cost.anomaly-detection — mid

Mid adds repository context for anomaly detection; it does not widen ownership beyond cost.anomaly-detection. The context signals are deviation_threshold_percent.

Ground the decision in the existing repository's anomaly detection convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in cost under their own verdicts.

Acceptance target: fixture:infrastructure.cost.anomaly-detection:repository-context. Given cost.anomaly-detection has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent cost concern; fail when the result infers local convention without an inspectable source.
