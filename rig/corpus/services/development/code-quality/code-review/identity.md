# development.code-quality.code-review — identity

Policy grade: code review owns code-quality.code-review. Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.

Keep neighboring code-quality services outside the code review decision for code-quality.code-review. Trace the verdict to the configured input at `rig-services/development.code-quality.code-review.json`; malformed input is still attributed to that path.

Disposition: convention. Anchor the review on the limit: code review configuration validation only; declared policy does not prove running code review behavior. Choose a repository-owned check that observes code review from rig-services/development.code-quality.code-review.json.

Acceptance target: fixture:development.code-quality.code-review:policy-boundary. Given source-code is present and code-quality.code-review is selected, pass only when the repository binding evaluates code-quality.code-review and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code quality concern.

Service-specific evidence cues:
Offer: Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.
minimal: review scope — ["src"].
mid: required reviewers — 1.
maximal: unresolved findings allowed — false.
