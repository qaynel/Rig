# testing.property-fuzz.shrinking — property-floor slice

Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.

Policy grade slice. This slice bounds shrinking to property-fuzz.shrinking. It uses `shrinking-slice-property-floor` and checks failure_predicate (nonempty): failure predicate must name the concrete repository contract.