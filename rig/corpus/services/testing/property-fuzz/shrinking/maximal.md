# testing.property-fuzz.shrinking — maximal

Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Policy grade, maximal: Set dropping the failure during shrink to false. A smaller input that no longer fails is useless, so keep the failure while reducing. Cumulative with minimal and mid. Binding checks: shrinking-source-code-boundary, shrinking-property-fuzz-context, shrinking-evidence-receipt.

Acceptance target: policy:testing.property-fuzz.shrinking:maximal:shrinking-source-code-boundary+shrinking-property-fuzz-context+shrinking-evidence-receipt.
Declared predicates: shrinking-source-code-boundary: `failure_predicate` is nonempty (a string or array); shrinking-property-fuzz-context: `preserved_constraints` is nonempty (a string or array); shrinking-evidence-receipt: `drop_failure_during_shrink` equals false.
