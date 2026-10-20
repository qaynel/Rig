# testing.property-fuzz.shrinking — mid

Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: shrinking-source-code-boundary, shrinking-property-fuzz-context.

Inspect the existing repository's shrinking convention, then name the source path or command that establishes it. For shrinking, inspect the repository's actual spec, source, test, or configuration for preserved_constraints; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring property-fuzz services outside the shrinking decision for property-fuzz.shrinking.

Acceptance target: policy:testing.property-fuzz.shrinking:mid:shrinking-source-code-boundary+shrinking-property-fuzz-context.

Declared predicates: shrinking-source-code-boundary: `failure_predicate` is nonempty (a string or array); shrinking-property-fuzz-context: `preserved_constraints` is nonempty (a string or array).
