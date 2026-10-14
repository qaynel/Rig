# testing.maintenance.dead-test-pruning — behavior-oracle slice

Policy grade slice. This slice bounds dead test pruning to maintenance.dead-test-pruning. It uses `dead-test-pruning-slice-behavior-oracle` and checks obsolete_cases (nonempty): obsolete cases must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.maintenance.dead-test-pruning.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than dead test pruning configuration validation only; declared policy does not prove running dead test pruning behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Owned scope: `maintenance.dead-test-pruning`.

Offer: Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Input: `rig-services/testing.maintenance.dead-test-pruning.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: dead test pruning configuration validation only; declared policy does not prove running dead test pruning behavior. Select an approved repository-owned command to verify that behavior.

minimal: obsolete cases — ["removed legacy endpoint"].

mid: replacement evidence — ["new endpoint contract passes"].

maximal: delete live regressions — false.
