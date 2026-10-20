# testing.performance-load.perf-regression-ci — behavior-oracle slice

Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Policy grade slice. This slice bounds perf regression ci to performance-load.perf-regression-ci. It uses `perf-regression-ci-slice-behavior-oracle` and checks tracked_metrics (nonempty): tracked metrics must name the concrete repository contract.