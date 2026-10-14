# testing.performance-load.perf-regression-ci — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for perf regression ci. It checks tracked_metrics (nonempty): tracked metrics must name the concrete repository contract.. Binding checks: perf-regression-ci-source-code-boundary.

Use a repository-owned command or existing native check that can observe performance-load.perf-regression-ci; bind it to the input named in `rig-services/testing.performance-load.perf-regression-ci.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside performance-load.perf-regression-ci is a failure.

Acceptance target: fixture:testing.performance-load.perf-regression-ci:policy-boundary. Given source-code is present and performance-load.perf-regression-ci is selected, pass only when the repository binding evaluates performance-load.perf-regression-ci and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance load concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Owned scope: `performance-load.perf-regression-ci`.

Offer: Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Input: `rig-services/testing.performance-load.perf-regression-ci.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: perf regression ci configuration validation only; declared policy does not prove running perf regression ci behavior. Select an approved repository-owned command to verify that behavior.

minimal: tracked metrics — ["p95 latency"].

mid: regression budget percent — 10.

maximal: ignore threshold failure — false.
