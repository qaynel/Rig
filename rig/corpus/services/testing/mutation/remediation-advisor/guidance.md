# remediation advisor

Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Owned scope: `mutation.remediation-advisor`.

Offer: Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Input: `rig-services/testing.mutation.remediation-advisor.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: remediation advisor configuration validation only; declared policy does not prove running remediation advisor behavior. Select an approved repository-owned command to verify that behavior.

minimal: remediation cases — ["reject exact upper limit"].

mid: target behaviors — ["limit enforcement"].

maximal: add implementation mirrors — false.

