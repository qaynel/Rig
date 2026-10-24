# testing.regression.change-impact — floor and mutation-floor slice

Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Policy grade slice `change-impact-slice-floor`: List the interfaces that changed. Impact starts from the change, so name each one.
