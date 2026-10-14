# testing.performance-load.perf-regression-ci — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for perf regression ci; it does not widen ownership beyond performance-load.perf-regression-ci. For perf regression ci, inspect these context signals: regression_budget_percent. Binding checks: perf-regression-ci-performance-load-context.

Start from the existing repository's perf regression ci convention, then name the source path or command that establishes it. For perf regression ci, inspect the repository's actual spec, source, test, or configuration for regression_budget_percent; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring performance-load services outside the perf regression ci decision for performance-load.perf-regression-ci.

Acceptance target: fixture:testing.performance-load.perf-regression-ci:repository-context. Given performance-load.perf-regression-ci has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent performance load concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Compare stable performance metrics with an explicit regression budget in CI. A breached budget must fail visibly rather than becoming a decorative chart.
minimal: tracked metrics — ["p95 latency"].
mid: regression budget percent — 10.
maximal: ignore threshold failure — false.
