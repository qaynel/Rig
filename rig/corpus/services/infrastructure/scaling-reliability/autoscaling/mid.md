# infrastructure.scaling-reliability.autoscaling — mid

Mid adds repository context for autoscaling; it does not widen ownership beyond scaling-reliability.autoscaling. The context signals are maximum_replicas.

Inspect the existing repository's autoscaling convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in scaling-reliability under their own verdicts.

Acceptance target: fixture:infrastructure.scaling-reliability.autoscaling:repository-context. Given scaling-reliability.autoscaling has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent scaling reliability concern; fail when the result infers local convention without an inspectable source.
