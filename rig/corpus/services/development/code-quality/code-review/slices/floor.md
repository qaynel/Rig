# development.code-quality.code-review — floor and mutation-floor slice

Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.

Policy grade slice. This slice bounds code review to code-quality.code-review. It uses `code-review-slice-floor` and checks review_scope (nonempty): review scope must name the concrete repository contract.