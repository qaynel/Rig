# development.repo-hygiene.issue-pr-triage — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for issue pr triage. The evidence must preserve the triage_labels, responsible_owners, close_without_disposition inputs that determined the result. Binding checks: issue-pr-triage-evidence-receipt.

Trace the verdict to a second run against unchanged issue pr triage inputs. Record the triage_labels, responsible_owners, close_without_disposition inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this issue pr triage result is stale. The ceiling remains: issue pr triage configuration validation only; declared policy does not prove running issue pr triage behavior. Choose a repository-owned check that observes issue pr triage from rig-services/development.repo-hygiene.issue-pr-triage.json.

Acceptance target: fixture:development.repo-hygiene.issue-pr-triage:evidence-replay. Given the repo-hygiene.issue-pr-triage binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.
minimal: triage labels — ["bug","needs-reproduction"].
mid: responsible owners — ["maintainers"].
maximal: close without disposition — false.
