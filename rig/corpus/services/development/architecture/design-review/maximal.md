# development.architecture.design-review — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for design review. The evidence must preserve the reviewed_interfaces, tradeoffs, unresolved_tradeoffs inputs that determined the result. Binding checks: design-review-evidence-receipt.

Inspect a second run against unchanged design review inputs. Record the reviewed_interfaces, tradeoffs, unresolved_tradeoffs inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this design review result is stale. The ceiling remains: design review configuration validation only; declared policy does not prove running design review behavior. Choose a repository-owned check that observes design review from rig-services/development.architecture.design-review.json.

Acceptance target: fixture:development.architecture.design-review:evidence-replay. Given the architecture.design-review binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.
minimal: reviewed interfaces — ["items API"].
mid: tradeoffs — ["latency versus durability"].
maximal: unresolved tradeoffs — 0.
