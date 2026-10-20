# design-review

Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Owned scope: `architecture.design-review`. Input: `rig-services/development.architecture.design-review.json`.

Coverage ceiling: Configuration validation only, so it confirms interfaces, tradeoffs and an unresolved-tradeoff count are declared; it does not show that the review found the real design flaws.

minimal: reviewed interfaces — ["items API"]. List the interfaces under review by name. An empty list means no boundary was reviewed, so name each interface the change touches before implementation starts.

mid: tradeoffs — ["latency versus durability"]. Record each tradeoff as a choice with the alternative rejected. A missing list means the review accepted the diagram as correct, so write the tradeoffs the interfaces force.

maximal: unresolved tradeoffs — 0. Unresolved tradeoffs must be exactly 0. A nonzero count means contradictory design assumptions reached implementation, so resolve or reject them in the review first.
