# perf regression ci

Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Owned scope: `performance-load.perf-regression-ci`.

Offer: Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Input: `rig-services/testing.performance-load.perf-regression-ci.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: perf regression ci configuration validation only; declared policy does not prove running perf regression ci behavior. Select an approved repository-owned command to verify that behavior.

minimal: tracked metrics — ["p95 latency"].

mid: regression budget percent — 10.

maximal: ignore threshold failure — false.
