# development.architecture.design-review — maximal

Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Policy grade, maximal: Unresolved tradeoffs must be exactly 0. A nonzero count means contradictory design assumptions reached implementation, so resolve or reject them in the review first. Cumulative with minimal and mid. Binding checks: design-review-source-code-boundary, design-review-architecture-context, design-review-evidence-receipt.

Acceptance target: policy:development.architecture.design-review:maximal:design-review-source-code-boundary+design-review-architecture-context+design-review-evidence-receipt.
Declared predicates: design-review-source-code-boundary: `reviewed_interfaces` is nonempty (a string or array); design-review-architecture-context: `tradeoffs` is nonempty (a string or array); design-review-evidence-receipt: `unresolved_tradeoffs` equals 0.
