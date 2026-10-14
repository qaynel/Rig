# infrastructure.cost.rightsizing — identity

Policy grade: rightsizing owns cost.rightsizing. Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Keep neighboring cost services outside the rightsizing decision for cost.rightsizing. Ground the decision in the configured input at `rig-services/infrastructure.cost.rightsizing.json`; malformed input is still attributed to that path.

Disposition: convention. Use the limit: rightsizing configuration validation only; declared policy does not prove running rightsizing behavior. Choose a repository-owned check that observes rightsizing from rig-services/infrastructure.cost.rightsizing.json.

Acceptance target: fixture:infrastructure.cost.rightsizing:policy-boundary. Given source-code is present and cost.rightsizing is selected, pass only when the repository binding evaluates cost.rightsizing and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cost concern.

Service-specific evidence cues:
Offer: Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.
minimal: candidate resources — ["worker pool"].
mid: minimum headroom percent — 20.
maximal: resize without workload evidence — false.
