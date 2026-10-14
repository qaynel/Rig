# development.repo-hygiene.issue-pr-triage — minimal

Minimal establishes a non-vacuous policy boundary for issue pr triage. It checks triage_labels (nonempty): triage labels must name the concrete repository contract..

Use a repository-owned command or existing native check that can observe repo-hygiene.issue-pr-triage; bind it to the input named in `rig-services/development.repo-hygiene.issue-pr-triage.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside repo-hygiene.issue-pr-triage is a failure.

Acceptance target: fixture:development.repo-hygiene.issue-pr-triage:policy-boundary. Given source-code is present and repo-hygiene.issue-pr-triage is selected, pass only when the repository binding evaluates repo-hygiene.issue-pr-triage and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent repo hygiene concern. A passing policy check does not establish runtime behavior.
