# user journeys

Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Owned scope: `e2e.user-journeys`.

Offer: Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Input: `rig-services/testing.e2e.user-journeys.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: user journeys configuration validation only; declared policy does not prove running user journeys behavior. Select an approved repository-owned command to verify that behavior.

minimal: journeys — ["create and retrieve item"].

mid: observable outcomes — ["item appears after refresh"].

maximal: assert only page loaded — false.

