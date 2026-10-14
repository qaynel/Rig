# development.repo-hygiene.stale-cleanup — minimal

Minimal establishes a non-vacuous policy boundary for stale cleanup. It checks candidate_paths (nonempty): candidate paths must name the concrete repository contract..

Ground the decision in a repository-owned command or existing native check that can observe repo-hygiene.stale-cleanup; bind it to the input named in `rig-services/development.repo-hygiene.stale-cleanup.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside repo-hygiene.stale-cleanup is a failure.

Acceptance target: fixture:development.repo-hygiene.stale-cleanup:policy-boundary. Given source-code is present and repo-hygiene.stale-cleanup is selected, pass only when the repository binding evaluates repo-hygiene.stale-cleanup and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent repo hygiene concern. A passing policy check does not establish runtime behavior.
