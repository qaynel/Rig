# development.repo-hygiene.issue-pr-triage — maximal

Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: issue-pr-triage-source-code-boundary, issue-pr-triage-repo-hygiene-context, issue-pr-triage-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:development.repo-hygiene.issue-pr-triage:maximal:issue-pr-triage-source-code-boundary+issue-pr-triage-repo-hygiene-context+issue-pr-triage-evidence-receipt.

Declared predicates: issue-pr-triage-source-code-boundary: `triage_labels` is nonempty (a string or array); issue-pr-triage-repo-hygiene-context: `responsible_owners` is nonempty (a string or array); issue-pr-triage-evidence-receipt: `close_without_disposition` equals false.
