# testing.performance-load.perf-regression-ci — behavior-oracle slice

Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Policy grade slice `perf-regression-ci-slice-behavior-oracle`: List the metrics tracked in CI. Untracked metrics cannot regress visibly, so name each one. Despite its name this slice is not a behavior oracle: it confirms tracked metrics, a regression budget and the ignore-failure flag are declared; it does not run CI.
