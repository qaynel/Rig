# infrastructure.cost.rightsizing — mid

Mid adds repository context for rightsizing; it does not widen ownership beyond cost.rightsizing. The context signals are minimum_headroom_percent.

Trace the verdict to the existing repository's rightsizing convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in cost under their own verdicts.

Acceptance target: fixture:infrastructure.cost.rightsizing:repository-context. Given cost.rightsizing has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent cost concern; fail when the result infers local convention without an inspectable source.
