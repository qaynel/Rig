# testing.property-fuzz.shrinking — maximal

Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: shrinking-source-code-boundary, shrinking-property-fuzz-context, shrinking-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:testing.property-fuzz.shrinking:maximal:shrinking-source-code-boundary+shrinking-property-fuzz-context+shrinking-evidence-receipt.

Declared predicates: shrinking-source-code-boundary: `failure_predicate` is nonempty (a string or array); shrinking-property-fuzz-context: `preserved_constraints` is nonempty (a string or array); shrinking-evidence-receipt: `drop_failure_during_shrink` equals false.
