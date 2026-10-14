# testing.e2e.browser-automation — minimal

Minimal establishes a non-vacuous policy boundary for browser automation. It checks browser_targets (nonempty): browser targets must name the concrete repository contract..

Use a repository-owned command or existing native check that can observe e2e.browser-automation; bind it to the input named in `rig-services/testing.e2e.browser-automation.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside e2e.browser-automation is a failure.

Acceptance target: fixture:testing.e2e.browser-automation:policy-boundary. Given source-code is present and e2e.browser-automation is selected, pass only when the repository binding evaluates e2e.browser-automation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent e2e concern. A passing policy check does not establish runtime behavior.
