# infrastructure.cost.rightsizing — identity

Policy grade: rightsizing owns cost.rightsizing. Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Keep sibling services in cost under their own verdicts. Ground the decision in the configured input at `rig-services/infrastructure.cost.rightsizing.json`; malformed input is still attributed to that path.

Disposition: convention. Use the limit: rightsizing configuration validation only; declared policy does not prove running rightsizing behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.cost.rightsizing:policy-boundary. Given source-code is present and cost.rightsizing is selected, pass only when the repository binding evaluates cost.rightsizing and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cost concern.

Service-specific evidence cues:
Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Owned scope: `cost.rightsizing`.

Offer: Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Input: `rig-services/infrastructure.cost.rightsizing.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: rightsizing configuration validation only; declared policy does not prove running rightsizing behavior. Select an approved repository-owned command to verify that behavior.

minimal: candidate resources — ["worker pool"].

mid: minimum headroom percent — 20.

maximal: resize without workload evidence — false.
