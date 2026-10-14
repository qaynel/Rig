# development.code-quality.code-review — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for code review. The evidence must preserve the review_scope, required_reviewers, unresolved_findings_allowed inputs that determined the result. Binding checks: code-review-evidence-receipt.

Read a second run against unchanged code review inputs. Record the review_scope, required_reviewers, unresolved_findings_allowed inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this code review result is stale. The ceiling remains: code review configuration validation only; declared policy does not prove running code review behavior. Choose a repository-owned check that observes code review from rig-services/development.code-quality.code-review.json.

Acceptance target: fixture:development.code-quality.code-review:evidence-replay. Given the code-quality.code-review binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.
minimal: review scope — ["src"].
mid: required reviewers — 1.
maximal: unresolved findings allowed — false.
