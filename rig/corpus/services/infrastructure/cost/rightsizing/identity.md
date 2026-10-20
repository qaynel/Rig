# infrastructure.cost.rightsizing — identity

Policy grade: rightsizing owns cost.rightsizing. Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Input: `rig-services/infrastructure.cost.rightsizing.json`. Configuration validation only, so it confirms candidate resources, headroom and the no-evidence-resize flag are declared; it does not read workload measurements.

Disposition: executable.
Acceptance target: policy:infrastructure.cost.rightsizing:minimal:rightsizing-source-code-boundary.
Declared predicates: rightsizing-source-code-boundary: `candidate_resources` is nonempty (a string or array).
