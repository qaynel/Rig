# development.architecture.design-review — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for design review. The evidence must preserve the reviewed_interfaces, tradeoffs, unresolved_tradeoffs inputs that determined the result. Binding checks: design-review-evidence-receipt.

Inspect a second run against unchanged design review inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: design review configuration validation only; declared policy does not prove running design review behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.architecture.design-review:evidence-replay. Given the architecture.design-review binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Owned scope: `architecture.design-review`.

Offer: Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Input: `rig-services/development.architecture.design-review.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: design review configuration validation only; declared policy does not prove running design review behavior. Select an approved repository-owned command to verify that behavior.

minimal: reviewed interfaces — ["items API"].

mid: tradeoffs — ["latency versus durability"].

maximal: unresolved tradeoffs — 0.
