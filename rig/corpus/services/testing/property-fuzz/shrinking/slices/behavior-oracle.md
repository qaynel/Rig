# testing.property-fuzz.shrinking — behavior-oracle slice

Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Policy grade slice. This slice bounds shrinking to property-fuzz.shrinking. It uses `shrinking-slice-behavior-oracle` and checks failure_predicate (nonempty): failure predicate must name the concrete repository contract.