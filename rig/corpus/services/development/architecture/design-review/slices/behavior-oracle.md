# development.architecture.design-review — behavior-oracle slice

Policy grade slice. This slice bounds design review to architecture.design-review. It uses `design-review-slice-behavior-oracle` and checks reviewed_interfaces (nonempty): reviewed interfaces must name the concrete repository contract..

For design review, choose a repository example that satisfies reviewed_interfaces at the behavior-oracle floor, plus a failure where reviewed interfaces must name the concrete repository contract. is false. For design review, wire `behavior-oracle` to `rig-services/development.architecture.design-review.json` and keep its verdict on reviewed_interfaces; missing evidence is a named gap, with ceiling design review configuration validation only; declared policy does not prove running design review behavior. Choose a repository-owned check that observes design review from rig-services/development.architecture.design-review.json..

Service-specific evidence cues:
Offer: Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.
minimal: reviewed interfaces — ["items API"].
mid: tradeoffs — ["latency versus durability"].
maximal: unresolved tradeoffs — 0.
