# development.code-quality.code-review — maximal

Maximal adds a replayable evidence receipt for code review. The evidence must preserve the review_scope, required_reviewers, unresolved_findings_allowed inputs that determined the result.

Read a second run against unchanged code review inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: code review configuration validation only; declared policy does not prove running code review behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-quality.code-review:evidence-replay. Given the code-quality.code-review binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
