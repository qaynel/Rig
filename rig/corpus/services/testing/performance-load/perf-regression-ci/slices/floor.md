# testing.performance-load.perf-regression-ci — floor and mutation-floor slice

Policy grade slice. This slice bounds perf regression ci to performance-load.perf-regression-ci. It uses `perf-regression-ci-slice-floor` and checks tracked_metrics (nonempty): tracked metrics must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.performance-load.perf-regression-ci.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than perf regression ci configuration validation only; declared policy does not prove running perf regression ci behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Owned scope: `performance-load.perf-regression-ci`.

Offer: Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Input: `rig-services/testing.performance-load.perf-regression-ci.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: perf regression ci configuration validation only; declared policy does not prove running perf regression ci behavior. Select an approved repository-owned command to verify that behavior.

minimal: tracked metrics — ["p95 latency"].

mid: regression budget percent — 10.

maximal: ignore threshold failure — false.
