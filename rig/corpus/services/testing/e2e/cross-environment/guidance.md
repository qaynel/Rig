# cross environment

Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Owned scope: `e2e.cross-environment`.

Offer: Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Input: `rig-services/testing.e2e.cross-environment.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: cross environment configuration validation only; declared policy does not prove running cross environment behavior. Select an approved repository-owned command to verify that behavior.

minimal: environments — ["linux","macos"].

mid: shared cases — ["install and run"].

maximal: assume platform equivalence — false.
