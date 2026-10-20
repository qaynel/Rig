# testing.e2e.cross-environment — minimal

Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Policy grade, minimal: List the environments the cases must run in. One passing platform says nothing about another, so name each OS or runtime. Binding checks: cross-environment-source-code-boundary.

Acceptance target: policy:testing.e2e.cross-environment:minimal:cross-environment-source-code-boundary.
Declared predicates: cross-environment-source-code-boundary: `environments` is nonempty (a string or array).
