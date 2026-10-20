# testing.performance-load.perf-regression-ci — maximal

Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Policy grade, maximal: Set ignoring threshold failure to false. A breached budget must fail the build, otherwise it is a decorative chart. Cumulative with minimal and mid. Binding checks: perf-regression-ci-source-code-boundary, perf-regression-ci-performance-load-context, perf-regression-ci-evidence-receipt.

Acceptance target: policy:testing.performance-load.perf-regression-ci:maximal:perf-regression-ci-source-code-boundary+perf-regression-ci-performance-load-context+perf-regression-ci-evidence-receipt.
Declared predicates: perf-regression-ci-source-code-boundary: `tracked_metrics` is nonempty (a string or array); perf-regression-ci-performance-load-context: `regression_budget_percent` is numeric and at least 10; perf-regression-ci-evidence-receipt: `ignore_threshold_failure` equals false.
