# testing.performance-load.perf-regression-ci — identity

Policy grade: perf-regression-ci owns performance-load.perf-regression-ci. Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Input: `rig-services/testing.performance-load.perf-regression-ci.json`. Configuration validation only, so it confirms tracked metrics, a regression budget and the ignore-failure flag are declared; it does not run CI.

Disposition: executable.
Acceptance target: policy:testing.performance-load.perf-regression-ci:minimal:perf-regression-ci-source-code-boundary.
Declared predicates: perf-regression-ci-source-code-boundary: `tracked_metrics` is nonempty (a string or array).
