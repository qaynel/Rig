# testing.maintenance.readability-dry — floor and mutation-floor slice

Policy grade slice. This slice bounds readability dry to maintenance.readability-dry. It uses `readability-dry-slice-floor` and checks scenario_names (nonempty): scenario names must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.maintenance.readability-dry.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than readability dry configuration validation only; declared policy does not prove running readability dry behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Owned scope: `maintenance.readability-dry`.

Offer: Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Input: `rig-services/testing.maintenance.readability-dry.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: readability dry configuration validation only; declared policy does not prove running readability dry behavior. Select an approved repository-owned command to verify that behavior.

minimal: scenario names — ["expired token is rejected"].

mid: shared helpers — ["create valid account"].

maximal: hide assertions in helpers — false.
