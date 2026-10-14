# development.code-quality.code-review — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for code review. The minimal boundary for code review checks review_scope (nonempty): review scope must name the concrete repository contract.. Binding checks: code-review-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe code-quality.code-review; bind it to the input named in `rig-services/development.code-quality.code-review.json` and preserve the check's failure status. When adopting this in an existing repository, connect code review to the command that inspects review_scope and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside code-quality.code-review as a failure.

Acceptance target: fixture:development.code-quality.code-review:policy-boundary. Given source-code is present and code-quality.code-review is selected, pass only when the repository binding evaluates code-quality.code-review and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code quality concern. The ceiling is code review configuration validation only; declared policy does not prove running code review behavior. Choose a repository-owned check that observes code review from rig-services/development.code-quality.code-review.json..

Service-specific evidence cues:
Offer: Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.
minimal: review scope — ["src"].
mid: required reviewers — 1.
maximal: unresolved findings allowed — false.
