# testing.integration.cross-module — minimal

Minimal establishes a non-vacuous policy boundary for cross module. It checks participating_modules (nonempty): participating modules must name the concrete repository contract..

Read a repository-owned command or existing native check that can observe integration.cross-module; bind it to the input named in `rig-services/testing.integration.cross-module.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside integration.cross-module is a failure.

Acceptance target: fixture:testing.integration.cross-module:policy-boundary. Given source-code is present and integration.cross-module is selected, pass only when the repository binding evaluates integration.cross-module and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern. A passing policy check does not establish runtime behavior.
