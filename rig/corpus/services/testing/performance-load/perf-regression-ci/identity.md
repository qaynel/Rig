# testing.performance-load.perf-regression-ci — identity

Policy grade: perf regression ci owns performance-load.perf-regression-ci. Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Keep sibling services in performance-load under their own verdicts. Read the configured input at `rig-services/testing.performance-load.perf-regression-ci.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: perf regression ci configuration validation only; declared policy does not prove running perf regression ci behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.performance-load.perf-regression-ci:policy-boundary. Given source-code is present and performance-load.perf-regression-ci is selected, pass only when the repository binding evaluates performance-load.perf-regression-ci and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance load concern.

Service-specific evidence cues:
Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Owned scope: `performance-load.perf-regression-ci`.

Offer: Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Input: `rig-services/testing.performance-load.perf-regression-ci.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: perf regression ci configuration validation only; declared policy does not prove running perf regression ci behavior. Select an approved repository-owned command to verify that behavior.

minimal: tracked metrics — ["p95 latency"].

mid: regression budget percent — 10.

maximal: ignore threshold failure — false.
