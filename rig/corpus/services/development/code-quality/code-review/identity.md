# development.code-quality.code-review — identity

Policy grade: code review owns code-quality.code-review. Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.

Keep neighboring code-quality services outside the code review decision for code-quality.code-review. Trace the verdict to the configured input at `rig-services/development.code-quality.code-review.json`; malformed input is still attributed to that path.

Disposition: executable. Anchor the review on the limit: code review configuration validation only; declared policy does not prove running code review behavior. Choose a repository-owned check that observes code review from rig-services/development.code-quality.code-review.json.

Acceptance target: policy:development.code-quality.code-review:minimal:code-review-source-code-boundary.

Declared predicates: code-review-source-code-boundary: `review_scope` is nonempty (a string or array).
