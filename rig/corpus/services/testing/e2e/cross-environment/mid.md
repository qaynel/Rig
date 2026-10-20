# testing.e2e.cross-environment — mid

Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Policy grade, mid: List the cases shared across those environments. Different cases per platform cannot be compared, so name the common set. Cumulative with minimal. Binding checks: cross-environment-source-code-boundary, cross-environment-e2e-context.

Acceptance target: policy:testing.e2e.cross-environment:mid:cross-environment-source-code-boundary+cross-environment-e2e-context.
Declared predicates: cross-environment-source-code-boundary: `environments` is nonempty (a string or array); cross-environment-e2e-context: `shared_cases` is nonempty (a string or array).
