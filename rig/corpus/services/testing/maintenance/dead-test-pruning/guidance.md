# dead test pruning

Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Owned scope: `maintenance.dead-test-pruning`.

Offer: Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Input: `rig-services/testing.maintenance.dead-test-pruning.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: dead test pruning configuration validation only; declared policy does not prove running dead test pruning behavior. Select an approved repository-owned command to verify that behavior.

minimal: obsolete cases — ["removed legacy endpoint"].

mid: replacement evidence — ["new endpoint contract passes"].

maximal: delete live regressions — false.

