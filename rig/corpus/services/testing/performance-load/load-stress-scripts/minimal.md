# testing.performance-load.load-stress-scripts — minimal

Minimal establishes a non-vacuous policy boundary for load stress scripts. It checks load_profile (nonempty): load profile must name the concrete repository contract..

Ground the decision in a repository-owned command or existing native check that can observe perf-load-test-authoring, load-stress-scripts; bind it to the input named in `rig-services/testing.performance-load.load-stress-scripts.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside perf-load-test-authoring, load-stress-scripts is a failure.

Acceptance target: fixture:testing.performance-load.load-stress-scripts:policy-boundary. Given source-code is present and perf-load-test-authoring is selected, pass only when the repository binding evaluates perf-load-test-authoring and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance load concern. A passing policy check does not establish runtime behavior.
