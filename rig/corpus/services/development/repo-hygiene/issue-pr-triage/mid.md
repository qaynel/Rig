# development.repo-hygiene.issue-pr-triage — mid

Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: issue-pr-triage-source-code-boundary, issue-pr-triage-repo-hygiene-context.

Start from the existing repository's issue pr triage convention, then name the source path or command that establishes it. For issue pr triage, inspect the repository's actual spec, source, test, or configuration for responsible_owners; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring repo-hygiene services outside the issue pr triage decision for repo-hygiene.issue-pr-triage.

Acceptance target: policy:development.repo-hygiene.issue-pr-triage:mid:issue-pr-triage-source-code-boundary+issue-pr-triage-repo-hygiene-context.

Declared predicates: issue-pr-triage-source-code-boundary: `triage_labels` is nonempty (a string or array); issue-pr-triage-repo-hygiene-context: `responsible_owners` is nonempty (a string or array).
