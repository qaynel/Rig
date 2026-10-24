# testing.regression.suite-curation — mid

Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Policy grade, mid: Give a written reason for each retired test. Removal without a reason can reopen a defect, so record why it was safe. Cumulative with minimal. Binding checks: suite-curation-source-code-boundary, suite-curation-regression-context.

Acceptance target: policy:testing.regression.suite-curation:mid:suite-curation-source-code-boundary+suite-curation-regression-context.
Declared predicates: suite-curation-source-code-boundary: `retained_suites` is nonempty (a string or array); suite-curation-regression-context: `retirement_reasons` is nonempty (a string or array).
