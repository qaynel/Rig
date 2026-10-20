# testing.performance-load.perf-regression-ci — minimal

Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for perf regression ci. The minimal boundary for perf regression ci checks tracked_metrics (nonempty): tracked metrics must name the concrete repository contract. Binding checks: perf-regression-ci-source-code-boundary.

Use a repository-owned command or existing native check that can observe performance-load.perf-regression-ci; bind it to the input named in `rig-services/testing.performance-load.perf-regression-ci.json` and preserve the check's failure status. When adopting this in an existing repository, connect perf regression ci to the command that inspects tracked_metrics and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside performance-load.perf-regression-ci as a failure.

Acceptance target: policy:testing.performance-load.perf-regression-ci:minimal:perf-regression-ci-source-code-boundary.

Declared predicates: perf-regression-ci-source-code-boundary: `tracked_metrics` is nonempty (a string or array).
