# development.repo-hygiene.issue-pr-triage — minimal

Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.

Policy grade, minimal: List the labels used to route issues. Unlabelled reports are not routed, so name the label set the repository uses. Binding checks: issue-pr-triage-source-code-boundary.

Acceptance target: policy:development.repo-hygiene.issue-pr-triage:minimal:issue-pr-triage-source-code-boundary.
Declared predicates: issue-pr-triage-source-code-boundary: `triage_labels` is nonempty (a string or array).
