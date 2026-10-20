# testing.property-fuzz.shrinking — identity

Policy grade: shrinking owns property-fuzz.shrinking. Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Input: `rig-services/testing.property-fuzz.shrinking.json`. Configuration validation only, so it confirms a failure predicate, preserved constraints and the drop-failure flag are declared; it does not shrink inputs.

Disposition: executable.
Acceptance target: policy:testing.property-fuzz.shrinking:minimal:shrinking-source-code-boundary.
Declared predicates: shrinking-source-code-boundary: `failure_predicate` is nonempty (a string or array).
