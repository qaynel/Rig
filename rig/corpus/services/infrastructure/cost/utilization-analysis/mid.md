# infrastructure.cost.utilization-analysis — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for utilization analysis; it does not widen ownership beyond cost.utilization-analysis. The context signals are observation_window_days. Binding checks: utilization-analysis-cost-context.

Start from the existing repository's utilization analysis convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in cost under their own verdicts.

Acceptance target: fixture:infrastructure.cost.utilization-analysis:repository-context. Given cost.utilization-analysis has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent cost concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.

Owned scope: `cost.utilization-analysis`.

Offer: Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.

Input: `rig-services/infrastructure.cost.utilization-analysis.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: utilization analysis configuration validation only; declared policy does not prove running utilization analysis behavior. Select an approved repository-owned command to verify that behavior.

minimal: observed resources — ["cpu","memory"].

mid: observation window days — 7.

maximal: decide from single peak — false.
