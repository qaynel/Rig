# testing.performance-load.perf-regression-ci — identity

Policy grade: perf regression ci owns performance-load.perf-regression-ci. Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Keep neighboring performance-load services outside the perf regression ci decision for performance-load.perf-regression-ci. Read the configured input at `rig-services/testing.performance-load.perf-regression-ci.json`; malformed input is still attributed to that path.

Disposition: executable. Ground the decision in the limit: perf regression ci configuration validation only; declared policy does not prove running perf regression ci behavior. Choose a repository-owned check that observes perf regression ci from rig-services/testing.performance-load.perf-regression-ci.json.

Acceptance target: policy:testing.performance-load.perf-regression-ci:minimal:perf-regression-ci-source-code-boundary.

Declared predicates: perf-regression-ci-source-code-boundary: `tracked_metrics` is nonempty (a string or array).
