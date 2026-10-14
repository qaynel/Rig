# testing.e2e.user-journeys — property-floor slice

Policy grade slice. This slice bounds user journeys to e2e.user-journeys. It uses `user-journeys-slice-property-floor` and checks journeys (nonempty): journeys must name the concrete repository contract..

Read a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.e2e.user-journeys.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than user journeys configuration validation only; declared policy does not prove running user journeys behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Owned scope: `e2e.user-journeys`.

Offer: Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Input: `rig-services/testing.e2e.user-journeys.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: user journeys configuration validation only; declared policy does not prove running user journeys behavior. Select an approved repository-owned command to verify that behavior.

minimal: journeys — ["create and retrieve item"].

mid: observable outcomes — ["item appears after refresh"].

maximal: assert only page loaded — false.
