# development.repo-hygiene.issue-pr-triage — minimal

Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for issue pr triage. The minimal boundary for issue pr triage checks triage_labels (nonempty): triage labels must name the concrete repository contract. Binding checks: issue-pr-triage-source-code-boundary.

Use a repository-owned command or existing native check that can observe repo-hygiene.issue-pr-triage; bind it to the input named in `rig-services/development.repo-hygiene.issue-pr-triage.json` and preserve the check's failure status. When adopting this in an existing repository, connect issue pr triage to the command that inspects triage_labels and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside repo-hygiene.issue-pr-triage as a failure.

Acceptance target: policy:development.repo-hygiene.issue-pr-triage:minimal:issue-pr-triage-source-code-boundary.

Declared predicates: issue-pr-triage-source-code-boundary: `triage_labels` is nonempty (a string or array).
