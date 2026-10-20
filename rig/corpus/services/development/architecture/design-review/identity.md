# development.architecture.design-review — identity

Policy grade: design review owns architecture.design-review. Review interfaces and explicit tradeoffs against the intended outcomes. Resolve contradictory design assumptions before implementation instead of treating an approved diagram as proof of correctness.

Keep neighboring architecture services outside the design review decision for architecture.design-review. Use the configured input at `rig-services/development.architecture.design-review.json`; malformed input is still attributed to that path.

Disposition: executable. Start from the limit: design review configuration validation only; declared policy does not prove running design review behavior. Choose a repository-owned check that observes design review from rig-services/development.architecture.design-review.json.

Acceptance target: policy:development.architecture.design-review:minimal:design-review-source-code-boundary.

Declared predicates: design-review-source-code-boundary: `reviewed_interfaces` is nonempty (a string or array).
