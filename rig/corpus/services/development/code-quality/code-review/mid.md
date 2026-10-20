# development.code-quality.code-review — mid

Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: code-review-source-code-boundary, code-review-code-quality-context.

Tie acceptance to the existing repository's code review convention, then name the source path or command that establishes it. For code review, inspect the repository's actual spec, source, test, or configuration for required_reviewers; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring code-quality services outside the code review decision for code-quality.code-review.

Acceptance target: policy:development.code-quality.code-review:mid:code-review-source-code-boundary+code-review-code-quality-context.

Declared predicates: code-review-source-code-boundary: `review_scope` is nonempty (a string or array); code-review-code-quality-context: `required_reviewers` is numeric and at least 1.
