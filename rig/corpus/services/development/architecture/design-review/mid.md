# development.architecture.design-review — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for design review; it does not widen ownership beyond architecture.design-review. The context signals are tradeoffs. Binding checks: design-review-architecture-context.

Anchor the review on the existing repository's design review convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in architecture under their own verdicts.

Acceptance target: fixture:development.architecture.design-review:repository-context. Given architecture.design-review has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent architecture concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Owned scope: `architecture.design-review`.

Offer: Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Input: `rig-services/development.architecture.design-review.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: design review configuration validation only; declared policy does not prove running design review behavior. Select an approved repository-owned command to verify that behavior.

minimal: reviewed interfaces — ["items API"].

mid: tradeoffs — ["latency versus durability"].

maximal: unresolved tradeoffs — 0.
