# development.architecture.design-review — identity

Policy grade: design review owns architecture.design-review. Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Keep sibling services in architecture under their own verdicts. Use the configured input at `rig-services/development.architecture.design-review.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: design review configuration validation only; declared policy does not prove running design review behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.architecture.design-review:policy-boundary. Given source-code is present and architecture.design-review is selected, pass only when the repository binding evaluates architecture.design-review and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent architecture concern.

Service-specific evidence cues:
Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Owned scope: `architecture.design-review`.

Offer: Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Input: `rig-services/development.architecture.design-review.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: design review configuration validation only; declared policy does not prove running design review behavior. Select an approved repository-owned command to verify that behavior.

minimal: reviewed interfaces — ["items API"].

mid: tradeoffs — ["latency versus durability"].

maximal: unresolved tradeoffs — 0.
