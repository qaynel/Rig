# infrastructure.cost.rightsizing — identity

Policy grade: rightsizing owns cost.rightsizing. Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Keep neighboring cost services outside the rightsizing decision for cost.rightsizing. Ground the decision in the configured input at `rig-services/infrastructure.cost.rightsizing.json`; malformed input is still attributed to that path.

Disposition: executable. Use the limit: rightsizing configuration validation only; declared policy does not prove running rightsizing behavior. Choose a repository-owned check that observes rightsizing from rig-services/infrastructure.cost.rightsizing.json.

Acceptance target: policy:infrastructure.cost.rightsizing:minimal:rightsizing-source-code-boundary.

Declared predicates: rightsizing-source-code-boundary: `candidate_resources` is nonempty (a string or array).
