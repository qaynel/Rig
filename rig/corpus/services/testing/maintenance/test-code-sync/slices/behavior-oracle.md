# testing.maintenance.test-code-sync — behavior-oracle slice

Policy grade slice. This slice bounds test code sync to maintenance.test-code-sync. It uses `test-code-sync-slice-behavior-oracle` and checks changed_behaviors (nonempty): changed behaviors must name the concrete repository contract..

Read a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.maintenance.test-code-sync.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than test code sync configuration validation only; declared policy does not prove running test code sync behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Owned scope: `maintenance.test-code-sync`.

Offer: Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Input: `rig-services/testing.maintenance.test-code-sync.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: test code sync configuration validation only; declared policy does not prove running test code sync behavior. Select an approved repository-owned command to verify that behavior.

minimal: changed behaviors — ["owner is required"].

mid: updated cases — ["reject missing owner"].

maximal: tests follow output blindly — false.
