# development.architecture.design-review — maximal

Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: design-review-source-code-boundary, design-review-architecture-context, design-review-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:development.architecture.design-review:maximal:design-review-source-code-boundary+design-review-architecture-context+design-review-evidence-receipt.

Declared predicates: design-review-source-code-boundary: `reviewed_interfaces` is nonempty (a string or array); design-review-architecture-context: `tradeoffs` is nonempty (a string or array); design-review-evidence-receipt: `unresolved_tradeoffs` equals 0.
