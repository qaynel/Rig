# testing.performance-load.perf-regression-ci — minimal

Minimal establishes a non-vacuous policy boundary for perf regression ci. It checks tracked_metrics (nonempty): tracked metrics must name the concrete repository contract..

Use a repository-owned command or existing native check that can observe performance-load.perf-regression-ci; bind it to the input named in `rig-services/testing.performance-load.perf-regression-ci.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside performance-load.perf-regression-ci is a failure.

Acceptance target: fixture:testing.performance-load.perf-regression-ci:policy-boundary. Given source-code is present and performance-load.perf-regression-ci is selected, pass only when the repository binding evaluates performance-load.perf-regression-ci and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance load concern. A passing policy check does not establish runtime behavior.
