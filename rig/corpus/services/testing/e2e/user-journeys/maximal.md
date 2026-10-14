# testing.e2e.user-journeys — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for user journeys. The evidence must preserve the journeys, observable_outcomes, assert_only_page_loaded inputs that determined the result. Binding checks: user-journeys-evidence-receipt.

Inspect a second run against unchanged user journeys inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: user journeys configuration validation only; declared policy does not prove running user journeys behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.e2e.user-journeys:evidence-replay. Given the e2e.user-journeys binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Owned scope: `e2e.user-journeys`.

Offer: Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.

Input: `rig-services/testing.e2e.user-journeys.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: user journeys configuration validation only; declared policy does not prove running user journeys behavior. Select an approved repository-owned command to verify that behavior.

minimal: journeys — ["create and retrieve item"].

mid: observable outcomes — ["item appears after refresh"].

maximal: assert only page loaded — false.
