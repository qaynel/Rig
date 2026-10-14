# infrastructure.cost.rightsizing — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for rightsizing. It checks candidate_resources (nonempty): candidate resources must name the concrete repository contract.. Binding checks: rightsizing-source-code-boundary.

Start from a repository-owned command or existing native check that can observe cost.rightsizing; bind it to the input named in `rig-services/infrastructure.cost.rightsizing.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside cost.rightsizing is a failure.

Acceptance target: fixture:infrastructure.cost.rightsizing:policy-boundary. Given source-code is present and cost.rightsizing is selected, pass only when the repository binding evaluates cost.rightsizing and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cost concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Owned scope: `cost.rightsizing`.

Offer: Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Input: `rig-services/infrastructure.cost.rightsizing.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: rightsizing configuration validation only; declared policy does not prove running rightsizing behavior. Select an approved repository-owned command to verify that behavior.

minimal: candidate resources — ["worker pool"].

mid: minimum headroom percent — 20.

maximal: resize without workload evidence — false.
