# development.repo-hygiene.issue-pr-triage — identity

Policy grade: issue-pr-triage owns repo-hygiene.issue-pr-triage. Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.

Input: `rig-services/development.repo-hygiene.issue-pr-triage.json`. Configuration validation only, so it confirms triage labels, owners and the close-without-disposition flag are declared; it does not show issues were actually triaged.

Disposition: executable.
Acceptance target: policy:development.repo-hygiene.issue-pr-triage:minimal:issue-pr-triage-source-code-boundary.
Declared predicates: issue-pr-triage-source-code-boundary: `triage_labels` is nonempty (a string or array).
