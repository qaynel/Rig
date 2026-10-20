# development.code-quality.code-review — minimal

Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.

Policy grade, minimal: State the changed scope under review. A review without a scope may cover nothing, so list the files or diff range actually examined. Binding checks: code-review-source-code-boundary.

Acceptance target: policy:development.code-quality.code-review:minimal:code-review-source-code-boundary.
Declared predicates: code-review-source-code-boundary: `review_scope` is nonempty (a string or array).
