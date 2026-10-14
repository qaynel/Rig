# infrastructure.cost.rightsizing — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for rightsizing; it does not widen ownership beyond cost.rightsizing. The context signals are minimum_headroom_percent. Binding checks: rightsizing-cost-context.

Trace the verdict to the existing repository's rightsizing convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in cost under their own verdicts.

Acceptance target: fixture:infrastructure.cost.rightsizing:repository-context. Given cost.rightsizing has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent cost concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Owned scope: `cost.rightsizing`.

Offer: Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Input: `rig-services/infrastructure.cost.rightsizing.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: rightsizing configuration validation only; declared policy does not prove running rightsizing behavior. Select an approved repository-owned command to verify that behavior.

minimal: candidate resources — ["worker pool"].

mid: minimum headroom percent — 20.

maximal: resize without workload evidence — false.
