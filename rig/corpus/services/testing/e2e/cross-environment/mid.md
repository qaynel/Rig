# testing.e2e.cross-environment — mid

Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: cross-environment-source-code-boundary, cross-environment-e2e-context.

Start from the existing repository's cross environment convention, then name the source path or command that establishes it. For cross environment, inspect the repository's actual spec, source, test, or configuration for shared_cases; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring e2e services outside the cross environment decision for e2e.cross-environment.

Acceptance target: policy:testing.e2e.cross-environment:mid:cross-environment-source-code-boundary+cross-environment-e2e-context.

Declared predicates: cross-environment-source-code-boundary: `environments` is nonempty (a string or array); cross-environment-e2e-context: `shared_cases` is nonempty (a string or array).
