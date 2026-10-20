# test code sync

Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Owned scope: `maintenance.test-code-sync`.

Offer: Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Input: `rig-services/testing.maintenance.test-code-sync.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: test code sync configuration validation only; declared policy does not prove running test code sync behavior. Select an approved repository-owned command to verify that behavior.

minimal: changed behaviors — ["owner is required"].

mid: updated cases — ["reject missing owner"].

maximal: tests follow output blindly — false.
