# development.architecture.design-review — minimal

Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Policy grade, minimal: List the interfaces under review by name. An empty list means no boundary was reviewed, so name each interface the change touches before implementation starts. Binding checks: design-review-source-code-boundary.

Acceptance target: policy:development.architecture.design-review:minimal:design-review-source-code-boundary.
Declared predicates: design-review-source-code-boundary: `reviewed_interfaces` is nonempty (a string or array).
