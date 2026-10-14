# coverage gap

Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Owned scope: `strategy.coverage-gap`.

Offer: Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Input: `rig-services/testing.strategy.coverage-gap.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: coverage gap configuration validation only; declared policy does not prove running coverage gap behavior. Select an approved repository-owned command to verify that behavior.

minimal: uncovered behaviors — ["expired token"].

mid: risk owners — ["auth team"].

maximal: claim complete from line coverage — false.

