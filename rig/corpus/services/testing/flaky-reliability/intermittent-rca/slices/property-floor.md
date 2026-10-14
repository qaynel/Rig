# testing.flaky-reliability.intermittent-rca — property-floor slice

Policy grade slice. This slice bounds intermittent rca to flaky-reliability.intermittent-rca. It uses `intermittent-rca-slice-property-floor` and checks observed_conditions (nonempty): observed conditions must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.flaky-reliability.intermittent-rca.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than intermittent rca configuration validation only; declared policy does not prove running intermittent rca behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Owned scope: `flaky-reliability.intermittent-rca`.

Offer: Capture the conditions correlated with intermittent failure and run discriminating reproductions. Calling a defect random without evidence delays the actual scheduling or resource cause.

Input: `rig-services/testing.flaky-reliability.intermittent-rca.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: intermittent rca configuration validation only; declared policy does not prove running intermittent rca behavior. Select an approved repository-owned command to verify that behavior.

minimal: observed conditions — ["parallel runs"].

mid: reproduction attempts — ["repeat with scheduler seed"].

maximal: blame randomness without evidence — false.
