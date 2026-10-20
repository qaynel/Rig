# testing.performance-load.perf-regression-ci — maximal

Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: perf-regression-ci-source-code-boundary, perf-regression-ci-performance-load-context, perf-regression-ci-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:testing.performance-load.perf-regression-ci:maximal:perf-regression-ci-source-code-boundary+perf-regression-ci-performance-load-context+perf-regression-ci-evidence-receipt.

Declared predicates: perf-regression-ci-source-code-boundary: `tracked_metrics` is nonempty (a string or array); perf-regression-ci-performance-load-context: `regression_budget_percent` is numeric and at least 10; perf-regression-ci-evidence-receipt: `ignore_threshold_failure` equals false.
