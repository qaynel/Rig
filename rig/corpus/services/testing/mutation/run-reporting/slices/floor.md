# testing.mutation.run-reporting — floor and mutation-floor slice

Policy grade slice. This slice bounds run reporting to mutation.run-reporting. It uses `run-reporting-slice-floor` and checks reported_outcomes (nonempty): reported outcomes must name the concrete repository contract..

Inspect a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.mutation.run-reporting.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than run reporting configuration validation only; declared policy does not prove running run reporting behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Owned scope: `mutation.run-reporting`.

Offer: Report mutation outcomes against the exact input revision and include inconclusive states. Redact sensitive input before any report leaves the producing environment.

Input: `rig-services/testing.mutation.run-reporting.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: run reporting configuration validation only; declared policy does not prove running run reporting behavior. Select an approved repository-owned command to verify that behavior.

minimal: reported outcomes — ["killed","survived","timeout"].

mid: input revision — "a1b2c3d".

maximal: publish raw secrets — false.
