# testing.maintenance.test-code-sync — minimal

Minimal establishes a non-vacuous policy boundary for test code sync. It checks changed_behaviors (nonempty): changed behaviors must name the concrete repository contract..

Trace the verdict to a repository-owned command or existing native check that can observe maintenance.test-code-sync; bind it to the input named in `rig-services/testing.maintenance.test-code-sync.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside maintenance.test-code-sync is a failure.

Acceptance target: fixture:testing.maintenance.test-code-sync:policy-boundary. Given source-code is present and maintenance.test-code-sync is selected, pass only when the repository binding evaluates maintenance.test-code-sync and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent maintenance concern. A passing policy check does not establish runtime behavior.
