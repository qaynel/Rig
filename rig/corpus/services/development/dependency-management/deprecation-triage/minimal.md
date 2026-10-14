# development.dependency-management.deprecation-triage — minimal

Minimal establishes a non-vacuous policy boundary for deprecation triage. It checks deprecated_apis (nonempty): deprecated apis must name the concrete repository contract..

Start from a repository-owned command or existing native check that can observe dependency-management.deprecation-triage; bind it to the input named in `rig-services/development.dependency-management.deprecation-triage.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside dependency-management.deprecation-triage is a failure.

Acceptance target: fixture:development.dependency-management.deprecation-triage:policy-boundary. Given source-code is present and dependency-management.deprecation-triage is selected, pass only when the repository binding evaluates dependency-management.deprecation-triage and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent dependency management concern. A passing policy check does not establish runtime behavior.
