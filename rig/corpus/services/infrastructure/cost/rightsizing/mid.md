# infrastructure.cost.rightsizing — mid

Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: rightsizing-source-code-boundary, rightsizing-cost-context.

Trace the verdict to the existing repository's rightsizing convention, then name the source path or command that establishes it. For rightsizing, inspect the repository's actual spec, source, test, or configuration for minimum_headroom_percent; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring cost services outside the rightsizing decision for cost.rightsizing.

Acceptance target: policy:infrastructure.cost.rightsizing:mid:rightsizing-source-code-boundary+rightsizing-cost-context.

Declared predicates: rightsizing-source-code-boundary: `candidate_resources` is nonempty (a string or array); rightsizing-cost-context: `minimum_headroom_percent` is numeric and at least 20.
