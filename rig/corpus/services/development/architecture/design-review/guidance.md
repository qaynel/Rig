# design review

Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Owned scope: `architecture.design-review`.

Offer: Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Input: `rig-services/development.architecture.design-review.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: design review configuration validation only; declared policy does not prove running design review behavior. Select an approved repository-owned command to verify that behavior.

minimal: reviewed interfaces — ["items API"].

mid: tradeoffs — ["latency versus durability"].

maximal: unresolved tradeoffs — 0.
