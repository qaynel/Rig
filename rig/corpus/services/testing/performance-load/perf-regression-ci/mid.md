# testing.performance-load.perf-regression-ci — mid

Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: perf-regression-ci-source-code-boundary, perf-regression-ci-performance-load-context.

Start from the existing repository's perf regression ci convention, then name the source path or command that establishes it. For perf regression ci, inspect the repository's actual spec, source, test, or configuration for regression_budget_percent; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring performance-load services outside the perf regression ci decision for performance-load.perf-regression-ci.

Acceptance target: policy:testing.performance-load.perf-regression-ci:mid:perf-regression-ci-source-code-boundary+perf-regression-ci-performance-load-context.

Declared predicates: perf-regression-ci-source-code-boundary: `tracked_metrics` is nonempty (a string or array); perf-regression-ci-performance-load-context: `regression_budget_percent` is numeric and at least 10.
