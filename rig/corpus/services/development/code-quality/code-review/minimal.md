# development.code-quality.code-review — minimal

Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for code review. The minimal boundary for code review checks review_scope (nonempty): review scope must name the concrete repository contract. Binding checks: code-review-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe code-quality.code-review; bind it to the input named in `rig-services/development.code-quality.code-review.json` and preserve the check's failure status. When adopting this in an existing repository, connect code review to the command that inspects review_scope and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside code-quality.code-review as a failure.

Acceptance target: policy:development.code-quality.code-review:minimal:code-review-source-code-boundary.

Declared predicates: code-review-source-code-boundary: `review_scope` is nonempty (a string or array).
