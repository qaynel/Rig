# infrastructure.cost.rightsizing — minimal

Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Policy grade, minimal: List the resources considered for resizing. Without candidates nothing is selected from data, so name each resource. Binding checks: rightsizing-source-code-boundary.

Acceptance target: policy:infrastructure.cost.rightsizing:minimal:rightsizing-source-code-boundary.
Declared predicates: rightsizing-source-code-boundary: `candidate_resources` is nonempty (a string or array).
