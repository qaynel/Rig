# infrastructure.cost.rightsizing — mid

Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Policy grade, mid: Keep minimum headroom of at least 20 percent. Shrinking to zero headroom risks outages on a spike, so retain the margin. Cumulative with minimal. Binding checks: rightsizing-source-code-boundary, rightsizing-cost-context.

Acceptance target: policy:infrastructure.cost.rightsizing:mid:rightsizing-source-code-boundary+rightsizing-cost-context.
Declared predicates: rightsizing-source-code-boundary: `candidate_resources` is nonempty (a string or array); rightsizing-cost-context: `minimum_headroom_percent` is numeric and at least 20.
