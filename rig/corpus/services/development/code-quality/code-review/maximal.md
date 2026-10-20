# development.code-quality.code-review — maximal

Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.

Policy grade, maximal: Unresolved findings must not be allowed. Setting this to true lets a change merge with open findings, so resolve or explicitly disposition each one. Cumulative with minimal and mid. Binding checks: code-review-source-code-boundary, code-review-code-quality-context, code-review-evidence-receipt.

Acceptance target: policy:development.code-quality.code-review:maximal:code-review-source-code-boundary+code-review-code-quality-context+code-review-evidence-receipt.
Declared predicates: code-review-source-code-boundary: `review_scope` is nonempty (a string or array); code-review-code-quality-context: `required_reviewers` is numeric and at least 1; code-review-evidence-receipt: `unresolved_findings_allowed` equals false.
