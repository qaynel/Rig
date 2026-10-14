# testing.e2e.cross-environment — property-floor slice

Policy grade slice. This slice bounds cross environment to e2e.cross-environment. It uses `cross-environment-slice-property-floor` and checks environments (nonempty): environments must name the concrete repository contract..

Inspect a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.e2e.cross-environment.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than cross environment configuration validation only; declared policy does not prove running cross environment behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Owned scope: `e2e.cross-environment`.

Offer: Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Input: `rig-services/testing.e2e.cross-environment.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: cross environment configuration validation only; declared policy does not prove running cross environment behavior. Select an approved repository-owned command to verify that behavior.

minimal: environments — ["linux","macos"].

mid: shared cases — ["install and run"].

maximal: assume platform equivalence — false.
