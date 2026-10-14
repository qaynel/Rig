# testing.strategy.coverage-gap — property-floor slice

Policy grade slice. This slice bounds coverage gap to strategy.coverage-gap. It uses `coverage-gap-slice-property-floor` and checks uncovered_behaviors (nonempty): uncovered behaviors must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.strategy.coverage-gap.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than coverage gap configuration validation only; declared policy does not prove running coverage gap behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Owned scope: `strategy.coverage-gap`.

Offer: Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Input: `rig-services/testing.strategy.coverage-gap.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: coverage gap configuration validation only; declared policy does not prove running coverage gap behavior. Select an approved repository-owned command to verify that behavior.

minimal: uncovered behaviors — ["expired token"].

mid: risk owners — ["auth team"].

maximal: claim complete from line coverage — false.
