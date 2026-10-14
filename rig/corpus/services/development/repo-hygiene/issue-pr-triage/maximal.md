# development.repo-hygiene.issue-pr-triage — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for issue pr triage. The evidence must preserve the triage_labels, responsible_owners, close_without_disposition inputs that determined the result. Binding checks: issue-pr-triage-evidence-receipt.

Trace the verdict to a second run against unchanged issue pr triage inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: issue pr triage configuration validation only; declared policy does not prove running issue pr triage behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.repo-hygiene.issue-pr-triage:evidence-replay. Given the repo-hygiene.issue-pr-triage binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.

Owned scope: `repo-hygiene.issue-pr-triage`.

Offer: Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.

Input: `rig-services/development.repo-hygiene.issue-pr-triage.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: issue pr triage configuration validation only; declared policy does not prove running issue pr triage behavior. Select an approved repository-owned command to verify that behavior.

minimal: triage labels — ["bug","needs-reproduction"].

mid: responsible owners — ["maintainers"].

maximal: close without disposition — false.
