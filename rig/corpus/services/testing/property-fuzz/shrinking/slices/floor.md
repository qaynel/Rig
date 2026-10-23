# testing.property-fuzz.shrinking — floor and mutation-floor slice

Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Policy grade slice `shrinking-slice-floor`: Declare the predicate that identifies the failure. A shrinker without it cannot tell failure from success, so write the check.
