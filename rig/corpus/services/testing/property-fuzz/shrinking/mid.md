# testing.property-fuzz.shrinking — mid

Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Policy grade, mid: List the domain constraints a shrunk input must keep. Violating them yields invalid cases, so name each constraint. Cumulative with minimal. Binding checks: shrinking-source-code-boundary, shrinking-property-fuzz-context.

Acceptance target: policy:testing.property-fuzz.shrinking:mid:shrinking-source-code-boundary+shrinking-property-fuzz-context.
Declared predicates: shrinking-source-code-boundary: `failure_predicate` is nonempty (a string or array); shrinking-property-fuzz-context: `preserved_constraints` is nonempty (a string or array).
