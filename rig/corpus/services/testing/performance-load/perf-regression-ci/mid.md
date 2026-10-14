# testing.performance-load.perf-regression-ci — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for perf regression ci; it does not widen ownership beyond performance-load.perf-regression-ci. The context signals are regression_budget_percent. Binding checks: perf-regression-ci-performance-load-context.

Start from the existing repository's perf regression ci convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in performance-load under their own verdicts.

Acceptance target: fixture:testing.performance-load.perf-regression-ci:repository-context. Given performance-load.perf-regression-ci has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent performance load concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Owned scope: `performance-load.perf-regression-ci`.

Offer: Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.

Input: `rig-services/testing.performance-load.perf-regression-ci.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: perf regression ci configuration validation only; declared policy does not prove running perf regression ci behavior. Select an approved repository-owned command to verify that behavior.

minimal: tracked metrics — ["p95 latency"].

mid: regression budget percent — 10.

maximal: ignore threshold failure — false.
