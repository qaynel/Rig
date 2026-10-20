# testing.property-fuzz.shrinking — behavior-oracle slice

Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Policy grade slice `shrinking-slice-behavior-oracle`: Declare the predicate that identifies the failure. A shrinker without it cannot tell failure from success, so write the check. Despite its name this slice is not a behavior oracle: it confirms a failure predicate, preserved constraints and the drop-failure flag are declared; it does not shrink inputs.
