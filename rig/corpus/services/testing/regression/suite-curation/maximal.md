# testing.regression.suite-curation — maximal

Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: suite-curation-source-code-boundary, suite-curation-regression-context, suite-curation-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:testing.regression.suite-curation:maximal:suite-curation-source-code-boundary+suite-curation-regression-context+suite-curation-evidence-receipt.

Declared predicates: suite-curation-source-code-boundary: `retained_suites` is nonempty (a string or array); suite-curation-regression-context: `retirement_reasons` is nonempty (a string or array); suite-curation-evidence-receipt: `remove_without_behavior_owner` equals false.
