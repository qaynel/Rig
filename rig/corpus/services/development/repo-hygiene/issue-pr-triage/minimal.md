# development.repo-hygiene.issue-pr-triage — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for issue pr triage. The minimal boundary for issue pr triage checks triage_labels (nonempty): triage labels must name the concrete repository contract.. Binding checks: issue-pr-triage-source-code-boundary.

Use a repository-owned command or existing native check that can observe repo-hygiene.issue-pr-triage; bind it to the input named in `rig-services/development.repo-hygiene.issue-pr-triage.json` and preserve the check's failure status. When adopting this in an existing repository, connect issue pr triage to the command that inspects triage_labels and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside repo-hygiene.issue-pr-triage as a failure.

Acceptance target: fixture:development.repo-hygiene.issue-pr-triage:policy-boundary. Given source-code is present and repo-hygiene.issue-pr-triage is selected, pass only when the repository binding evaluates repo-hygiene.issue-pr-triage and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent repo hygiene concern. The ceiling is issue pr triage configuration validation only; declared policy does not prove running issue pr triage behavior. Choose a repository-owned check that observes issue pr triage from rig-services/development.repo-hygiene.issue-pr-triage.json..

Service-specific evidence cues:
Offer: Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.
minimal: triage labels — ["bug","needs-reproduction"].
mid: responsible owners — ["maintainers"].
maximal: close without disposition — false.
