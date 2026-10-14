# infrastructure.scaling-reliability.chaos-engineering — mid

Mid adds repository context for chaos engineering; it does not widen ownership beyond scaling-reliability.chaos-engineering. The context signals are stop_conditions.

Inspect the existing repository's chaos engineering convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in scaling-reliability under their own verdicts.

Acceptance target: fixture:infrastructure.scaling-reliability.chaos-engineering:repository-context. Given scaling-reliability.chaos-engineering has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent scaling reliability concern; fail when the result infers local convention without an inspectable source.
