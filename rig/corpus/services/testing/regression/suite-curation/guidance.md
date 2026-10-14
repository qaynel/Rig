# suite curation

Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Owned scope: `regression.suite-curation`.

Offer: Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Input: `rig-services/testing.regression.suite-curation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: suite curation configuration validation only; declared policy does not prove running suite curation behavior. Select an approved repository-owned command to verify that behavior.

minimal: retained suites — ["critical regression"].

mid: retirement reasons — ["obsolete API removed"].

maximal: remove without behavior owner — false.

