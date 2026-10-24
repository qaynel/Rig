# testing.property-fuzz.shrinking — minimal

Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Policy grade, minimal: Declare the predicate that identifies the failure. A shrinker without it cannot tell failure from success, so write the check. Binding checks: shrinking-source-code-boundary.

Acceptance target: policy:testing.property-fuzz.shrinking:minimal:shrinking-source-code-boundary.
Declared predicates: shrinking-source-code-boundary: `failure_predicate` is nonempty (a string or array).
