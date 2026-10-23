# testing.performance-load.perf-regression-ci — minimal

Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Policy grade, minimal: List the metrics tracked in CI. Untracked metrics cannot regress visibly, so name each one. Binding checks: perf-regression-ci-source-code-boundary.

Acceptance target: policy:testing.performance-load.perf-regression-ci:minimal:perf-regression-ci-source-code-boundary.
Declared predicates: perf-regression-ci-source-code-boundary: `tracked_metrics` is nonempty (a string or array).
