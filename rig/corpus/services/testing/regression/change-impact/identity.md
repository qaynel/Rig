# testing.regression.change-impact — identity

Policy grade: change-impact owns regression.change-impact. Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Input: `rig-services/testing.regression.change-impact.json`. Configuration validation only, so it confirms changed interfaces, affected suites and the filename-only flag are declared; it does not trace callers.

Disposition: executable.
Acceptance target: policy:testing.regression.change-impact:minimal:change-impact-source-code-boundary.
Declared predicates: change-impact-source-code-boundary: `changed_interfaces` is nonempty (a string or array).
