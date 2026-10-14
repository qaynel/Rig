# infrastructure.provisioning.capacity-planning — behavior-oracle slice

Policy grade slice. This slice bounds capacity planning to provisioning.capacity-planning. It uses `capacity-planning-slice-behavior-oracle` and checks peak_requests_per_second (minimum 100): peak requests per second must meet the configured minimum of 100..

Read a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.provisioning.capacity-planning.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than capacity planning configuration validation only; declared policy does not prove running capacity planning behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Owned scope: `provisioning.capacity-planning`.

Offer: Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Input: `rig-services/infrastructure.provisioning.capacity-planning.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: capacity planning configuration validation only; declared policy does not prove running capacity planning behavior. Select an approved repository-owned command to verify that behavior.

minimal: peak requests per second — 100.

mid: headroom percent — 30.

maximal: ignore growth forecast — false.
