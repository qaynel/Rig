# development.code-quality.code-review — identity

Policy grade: code-review owns code-quality.code-review. Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.

Input: `rig-services/development.code-quality.code-review.json`. Configuration validation only, so it confirms review scope, reviewer count and the unresolved-findings setting are declared; it does not show the review was thorough.

Disposition: executable.
Acceptance target: policy:development.code-quality.code-review:minimal:code-review-source-code-boundary.
Declared predicates: code-review-source-code-boundary: `review_scope` is nonempty (a string or array).
