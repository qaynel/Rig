# development.repo-hygiene.issue-pr-triage — maximal

Maximal adds a replayable evidence receipt for issue pr triage. The evidence must preserve the triage_labels, responsible_owners, close_without_disposition inputs that determined the result.

Trace the verdict to a second run against unchanged issue pr triage inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: issue pr triage configuration validation only; declared policy does not prove running issue pr triage behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.repo-hygiene.issue-pr-triage:evidence-replay. Given the repo-hygiene.issue-pr-triage binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
