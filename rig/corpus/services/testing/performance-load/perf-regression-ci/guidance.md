# perf-regression-ci

Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Owned scope: `performance-load.perf-regression-ci`. Input: `rig-services/testing.performance-load.perf-regression-ci.json`.

Coverage ceiling: Configuration validation only, so it confirms tracked metrics, a regression budget and the ignore-failure flag are declared; it does not run CI.

minimal: tracked metrics — ["p95 latency"]. List the metrics tracked in CI. Untracked metrics cannot regress visibly, so name each one.

mid: regression budget percent — 10. Set the regression budget percent, at least 10. A budget that is too tight flakes, so choose a stable threshold.

maximal: ignore threshold failure — false. Set ignoring threshold failure to false. A breached budget must fail the build, otherwise it is a decorative chart.
