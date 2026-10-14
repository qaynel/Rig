# testing.performance-load.perf-regression-ci — identity

Policy grade: perf regression ci owns performance-load.perf-regression-ci. Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Keep neighboring performance-load services outside the perf regression ci decision for performance-load.perf-regression-ci. Read the configured input at `rig-services/testing.performance-load.perf-regression-ci.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: perf regression ci configuration validation only; declared policy does not prove running perf regression ci behavior. Choose a repository-owned check that observes perf regression ci from rig-services/testing.performance-load.perf-regression-ci.json.

Acceptance target: fixture:testing.performance-load.perf-regression-ci:policy-boundary. Given source-code is present and performance-load.perf-regression-ci is selected, pass only when the repository binding evaluates performance-load.perf-regression-ci and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance load concern.

Service-specific evidence cues:
Offer: Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.
minimal: tracked metrics — ["p95 latency"].
mid: regression budget percent — 10.
maximal: ignore threshold failure — false.
