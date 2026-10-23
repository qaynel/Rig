# testing.performance-load.perf-regression-ci — mid

Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Policy grade, mid: Set the regression budget percent, at least 10. A budget that is too tight flakes, so choose a stable threshold. Cumulative with minimal. Binding checks: perf-regression-ci-source-code-boundary, perf-regression-ci-performance-load-context.

Acceptance target: policy:testing.performance-load.perf-regression-ci:mid:perf-regression-ci-source-code-boundary+perf-regression-ci-performance-load-context.
Declared predicates: perf-regression-ci-source-code-boundary: `tracked_metrics` is nonempty (a string or array); perf-regression-ci-performance-load-context: `regression_budget_percent` is numeric and at least 10.
