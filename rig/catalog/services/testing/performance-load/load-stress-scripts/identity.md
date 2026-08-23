# testing.performance-load.load-stress-scripts - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

load stress scripts is the sole catalogue owner of `perf-load-test-authoring`, `load-stress-scripts`. It must not absorb other performance load concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `perf-load-test-authoring`, `load-stress-scripts`, the result is a named nonzero coverage gap.

Acceptance target: fixture:testing.performance-load.load-stress-scripts:policy-boundary. Given source-code is present and perf-load-test-authoring is selected, pass only when the repository binding evaluates perf-load-test-authoring and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent performance load concern.
