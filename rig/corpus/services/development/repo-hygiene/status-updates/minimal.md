# development.repo-hygiene.status-updates — minimal

Minimal establishes a non-vacuous policy boundary for status updates. It checks completed (nonempty): completed must name the concrete repository contract..

Start from a repository-owned command or existing native check that can observe repo-hygiene.status-updates; bind it to the input named in `rig-services/development.repo-hygiene.status-updates.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside repo-hygiene.status-updates is a failure.

Acceptance target: fixture:development.repo-hygiene.status-updates:policy-boundary. Given source-code is present and repo-hygiene.status-updates is selected, pass only when the repository binding evaluates repo-hygiene.status-updates and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent repo hygiene concern. A passing policy check does not establish runtime behavior.
