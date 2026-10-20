# testing.regression.suite-curation — mid

Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: suite-curation-source-code-boundary, suite-curation-regression-context.

Start from the existing repository's suite curation convention, then name the source path or command that establishes it. For suite curation, inspect the repository's actual spec, source, test, or configuration for retirement_reasons; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring regression services outside the suite curation decision for regression.suite-curation.

Acceptance target: policy:testing.regression.suite-curation:mid:suite-curation-source-code-boundary+suite-curation-regression-context.

Declared predicates: suite-curation-source-code-boundary: `retained_suites` is nonempty (a string or array); suite-curation-regression-context: `retirement_reasons` is nonempty (a string or array).
