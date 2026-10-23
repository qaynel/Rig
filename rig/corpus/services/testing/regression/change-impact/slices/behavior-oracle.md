# testing.regression.change-impact — behavior-oracle slice

Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Policy grade slice `change-impact-slice-behavior-oracle`: List the interfaces that changed. Impact starts from the change, so name each one. Despite its name this slice is not a behavior oracle: it confirms changed interfaces, affected suites and the filename-only flag are declared; it does not trace callers.
