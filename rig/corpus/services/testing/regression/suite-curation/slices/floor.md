# testing.regression.suite-curation — floor and mutation-floor slice

Policy grade slice. This slice bounds suite curation to regression.suite-curation. It uses `suite-curation-slice-floor` and checks retained_suites (nonempty): retained suites must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.regression.suite-curation.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than suite curation configuration validation only; declared policy does not prove running suite curation behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Owned scope: `regression.suite-curation`.

Offer: Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Input: `rig-services/testing.regression.suite-curation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: suite curation configuration validation only; declared policy does not prove running suite curation behavior. Select an approved repository-owned command to verify that behavior.

minimal: retained suites — ["critical regression"].

mid: retirement reasons — ["obsolete API removed"].

maximal: remove without behavior owner — false.
