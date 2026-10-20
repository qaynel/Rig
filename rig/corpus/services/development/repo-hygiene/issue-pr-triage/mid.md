# development.repo-hygiene.issue-pr-triage — mid

Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.

Policy grade, mid: Name the owner responsible for each triage lane. Without an accountable owner reports stall, so assign people or teams. Cumulative with minimal. Binding checks: issue-pr-triage-source-code-boundary, issue-pr-triage-repo-hygiene-context.

Acceptance target: policy:development.repo-hygiene.issue-pr-triage:mid:issue-pr-triage-source-code-boundary+issue-pr-triage-repo-hygiene-context.
Declared predicates: issue-pr-triage-source-code-boundary: `triage_labels` is nonempty (a string or array); issue-pr-triage-repo-hygiene-context: `responsible_owners` is nonempty (a string or array).
