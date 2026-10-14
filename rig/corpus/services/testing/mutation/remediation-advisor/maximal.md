# testing.mutation.remediation-advisor — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for remediation advisor. The evidence must preserve the remediation_cases, target_behaviors, add_implementation_mirrors inputs that determined the result. Binding checks: remediation-advisor-evidence-receipt.

Inspect a second run against unchanged remediation advisor inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: remediation advisor configuration validation only; declared policy does not prove running remediation advisor behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.remediation-advisor:evidence-replay. Given the mutation.remediation-advisor binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Owned scope: `mutation.remediation-advisor`.

Offer: Propose new behavioral assertions for the specific survived mutation. Tests that reproduce the implementation algorithm share its mistake instead of exposing it.

Input: `rig-services/testing.mutation.remediation-advisor.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: remediation advisor configuration validation only; declared policy does not prove running remediation advisor behavior. Select an approved repository-owned command to verify that behavior.

minimal: remediation cases — ["reject exact upper limit"].

mid: target behaviors — ["limit enforcement"].

maximal: add implementation mirrors — false.
