# testing.regression.change-impact — property-floor slice

Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Policy grade slice. This slice bounds change impact to regression.change-impact. It uses `change-impact-slice-property-floor` and checks changed_interfaces (nonempty): changed interfaces must name the concrete repository contract.