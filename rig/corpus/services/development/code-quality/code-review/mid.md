# development.code-quality.code-review — mid

Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.

Policy grade, mid: Require at least 1 reviewer who did not author the change. Zero reviewers is self-approval, so set the minimum reviewer count to 1 or more. Cumulative with minimal. Binding checks: code-review-source-code-boundary, code-review-code-quality-context.

Acceptance target: policy:development.code-quality.code-review:mid:code-review-source-code-boundary+code-review-code-quality-context.
Declared predicates: code-review-source-code-boundary: `review_scope` is nonempty (a string or array); code-review-code-quality-context: `required_reviewers` is numeric and at least 1.
