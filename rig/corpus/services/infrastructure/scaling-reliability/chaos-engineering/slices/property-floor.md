# infrastructure.scaling-reliability.chaos-engineering — property-floor slice

Policy grade slice. This slice bounds chaos engineering to scaling-reliability.chaos-engineering. It uses `chaos-engineering-slice-property-floor` and checks fault_scenarios (nonempty): fault scenarios must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.scaling-reliability.chaos-engineering.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than chaos engineering configuration validation only; declared policy does not prove running chaos engineering behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Owned scope: `scaling-reliability.chaos-engineering`.

Offer: Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.

Input: `rig-services/infrastructure.scaling-reliability.chaos-engineering.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: chaos engineering configuration validation only; declared policy does not prove running chaos engineering behavior. Select an approved repository-owned command to verify that behavior.

minimal: fault scenarios — ["worker unavailable"].

mid: stop conditions — ["error budget exhausted"].

maximal: production experiment without approval — false.
