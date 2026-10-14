# development.code-quality.code-review — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for code review. The evidence must preserve the review_scope, required_reviewers, unresolved_findings_allowed inputs that determined the result. Binding checks: code-review-evidence-receipt.

Read a second run against unchanged code review inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: code review configuration validation only; declared policy does not prove running code review behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-quality.code-review:evidence-replay. Given the code-quality.code-review binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.

Owned scope: `code-quality.code-review`.

Offer: Review the actual changed scope with independent ownership. At least one reviewer must resolve or explicitly disposition every finding before the change earns a clean review.

Input: `rig-services/development.code-quality.code-review.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: code review configuration validation only; declared policy does not prove running code review behavior. Select an approved repository-owned command to verify that behavior.

minimal: review scope — ["src"].

mid: required reviewers — 1.

maximal: unresolved findings allowed — false.
