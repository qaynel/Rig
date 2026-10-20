# testing.performance-load.perf-regression-ci — floor and mutation-floor slice

Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Policy grade slice `perf-regression-ci-slice-floor`: List the metrics tracked in CI. Untracked metrics cannot regress visibly, so name each one.
