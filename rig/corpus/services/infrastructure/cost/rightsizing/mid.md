# infrastructure.cost.rightsizing — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for rightsizing; it does not widen ownership beyond cost.rightsizing. For rightsizing, inspect these context signals: minimum_headroom_percent. Binding checks: rightsizing-cost-context.

Trace the verdict to the existing repository's rightsizing convention, then name the source path or command that establishes it. For rightsizing, inspect the repository's actual spec, source, test, or configuration for minimum_headroom_percent; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring cost services outside the rightsizing decision for cost.rightsizing.

Acceptance target: fixture:infrastructure.cost.rightsizing:repository-context. Given cost.rightsizing has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent cost concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.
minimal: candidate resources — ["worker pool"].
mid: minimum headroom percent — 20.
maximal: resize without workload evidence — false.
