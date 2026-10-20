# infrastructure.cost.rightsizing — maximal

Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Policy grade, maximal: Set resizing without workload evidence to false. Configuration alone cannot justify shrinking production, so require measurements. Cumulative with minimal and mid. Binding checks: rightsizing-source-code-boundary, rightsizing-cost-context, rightsizing-evidence-receipt.

Acceptance target: policy:infrastructure.cost.rightsizing:maximal:rightsizing-source-code-boundary+rightsizing-cost-context+rightsizing-evidence-receipt.
Declared predicates: rightsizing-source-code-boundary: `candidate_resources` is nonempty (a string or array); rightsizing-cost-context: `minimum_headroom_percent` is numeric and at least 20; rightsizing-evidence-receipt: `resize_without_workload_evidence` equals false.
