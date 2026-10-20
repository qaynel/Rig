# testing.regression.suite-curation — maximal

Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Policy grade, maximal: Set removing without a behavior owner to false. A test with no identified owner is deleted blindly, so name who owns the behavior first. Cumulative with minimal and mid. Binding checks: suite-curation-source-code-boundary, suite-curation-regression-context, suite-curation-evidence-receipt.

Acceptance target: policy:testing.regression.suite-curation:maximal:suite-curation-source-code-boundary+suite-curation-regression-context+suite-curation-evidence-receipt.
Declared predicates: suite-curation-source-code-boundary: `retained_suites` is nonempty (a string or array); suite-curation-regression-context: `retirement_reasons` is nonempty (a string or array); suite-curation-evidence-receipt: `remove_without_behavior_owner` equals false.
