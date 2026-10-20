# development.architecture.design-review — identity

Policy grade: design-review owns architecture.design-review. Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Input: `rig-services/development.architecture.design-review.json`. Configuration validation only, so it confirms interfaces, tradeoffs and an unresolved-tradeoff count are declared; it does not show that the review found the real design flaws.

Disposition: executable.
Acceptance target: policy:development.architecture.design-review:minimal:design-review-source-code-boundary.
Declared predicates: design-review-source-code-boundary: `reviewed_interfaces` is nonempty (a string or array).
