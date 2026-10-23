# development.architecture.design-review — mid

Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Policy grade, mid: Record each tradeoff as a choice with the alternative rejected. A missing list means the review accepted the diagram as correct, so write the tradeoffs the interfaces force. Cumulative with minimal. Binding checks: design-review-source-code-boundary, design-review-architecture-context.

Acceptance target: policy:development.architecture.design-review:mid:design-review-source-code-boundary+design-review-architecture-context.
Declared predicates: design-review-source-code-boundary: `reviewed_interfaces` is nonempty (a string or array); design-review-architecture-context: `tradeoffs` is nonempty (a string or array).
