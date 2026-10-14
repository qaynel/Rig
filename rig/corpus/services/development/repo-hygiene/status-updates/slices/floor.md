# development.repo-hygiene.status-updates — floor and mutation-floor slice

Policy grade slice. This slice bounds status updates to repo-hygiene.status-updates. It uses `status-updates-slice-floor` and checks completed (nonempty): completed must name the concrete repository contract..

Read a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.repo-hygiene.status-updates.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than status updates configuration validation only; declared policy does not prove running status updates behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.

Owned scope: `repo-hygiene.status-updates`.

Offer: Report observed progress, the work in flight and the next resolving action. Distinguish finished evidence from intended work so another contributor can resume accurately.

Input: `rig-services/development.repo-hygiene.status-updates.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: status updates configuration validation only; declared policy does not prove running status updates behavior. Select an approved repository-owned command to verify that behavior.

minimal: completed — ["parser regression reproduced"].

mid: in flight — ["shared boundary fix"].

maximal: next action — "run parser regression".
