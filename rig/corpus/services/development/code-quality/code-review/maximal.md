# development.code-quality.code-review — maximal

Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: code-review-source-code-boundary, code-review-code-quality-context, code-review-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:development.code-quality.code-review:maximal:code-review-source-code-boundary+code-review-code-quality-context+code-review-evidence-receipt.

Declared predicates: code-review-source-code-boundary: `review_scope` is nonempty (a string or array); code-review-code-quality-context: `required_reviewers` is numeric and at least 1; code-review-evidence-receipt: `unresolved_findings_allowed` equals false.
