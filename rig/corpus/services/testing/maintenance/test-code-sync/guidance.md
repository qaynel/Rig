# test-code-sync

Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Owned scope: `maintenance.test-code-sync`. Input: `rig-services/testing.maintenance.test-code-sync.json`.

Coverage ceiling: Configuration validation only, so it confirms changed behaviors, updated cases and the follow-output flag are declared; it does not compare tests with code.

minimal: changed behaviors — ["owner is required"]. List the behaviors that changed. Tests cannot follow a change nobody named, so state each one.

mid: updated cases — ["reject missing owner"]. List the test cases updated for those behaviors. A changed behavior with no updated case leaves stale tests, so map each.

maximal: tests follow output blindly — false. Set tests following output blindly to false. Copying new output into old assertions makes circular evidence, so decide the intended behavior first.
