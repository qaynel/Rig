# development.repo-hygiene.issue-pr-triage — maximal

Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.

Policy grade, maximal: Set closing without a disposition to false. Inactivity alone does not resolve a report, so close only with a written reason or a proving fix. Cumulative with minimal and mid. Binding checks: issue-pr-triage-source-code-boundary, issue-pr-triage-repo-hygiene-context, issue-pr-triage-evidence-receipt.

Acceptance target: policy:development.repo-hygiene.issue-pr-triage:maximal:issue-pr-triage-source-code-boundary+issue-pr-triage-repo-hygiene-context+issue-pr-triage-evidence-receipt.
Declared predicates: issue-pr-triage-source-code-boundary: `triage_labels` is nonempty (a string or array); issue-pr-triage-repo-hygiene-context: `responsible_owners` is nonempty (a string or array); issue-pr-triage-evidence-receipt: `close_without_disposition` equals false.
