# testing.flaky-reliability.detection-quarantine — minimal

Minimal establishes a non-vacuous policy boundary for detection quarantine. It checks flaky_cases (nonempty): flaky cases must name the concrete repository contract..

Read a repository-owned command or existing native check that can observe flaky-reliability.detection-quarantine; bind it to the input named in `rig-services/testing.flaky-reliability.detection-quarantine.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside flaky-reliability.detection-quarantine is a failure.

Acceptance target: fixture:testing.flaky-reliability.detection-quarantine:policy-boundary. Given source-code is present and flaky-reliability.detection-quarantine is selected, pass only when the repository binding evaluates flaky-reliability.detection-quarantine and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent flaky reliability concern. A passing policy check does not establish runtime behavior.
