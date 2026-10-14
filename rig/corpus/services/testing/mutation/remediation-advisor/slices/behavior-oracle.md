# testing.mutation.remediation-advisor — behavior-oracle slice

Policy grade slice. This slice bounds remediation advisor to mutation.remediation-advisor. It uses `remediation-advisor-slice-behavior-oracle` and checks remediation_cases (nonempty): remediation cases must name the concrete repository contract..

Read a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.mutation.remediation-advisor.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than remediation advisor configuration validation only; declared policy does not prove running remediation advisor behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Owned scope: `mutation.remediation-advisor`.

Offer: Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Input: `rig-services/testing.mutation.remediation-advisor.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: remediation advisor configuration validation only; declared policy does not prove running remediation advisor behavior. Select an approved repository-owned command to verify that behavior.

minimal: remediation cases — ["reject exact upper limit"].

mid: target behaviors — ["limit enforcement"].

maximal: add implementation mirrors — false.
