# testing.e2e.cross-environment — maximal

Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Policy grade, maximal: Set assuming platform equivalence to false. Filesystem and process semantics differ, so record each environment's result separately. Cumulative with minimal and mid. Binding checks: cross-environment-source-code-boundary, cross-environment-e2e-context, cross-environment-evidence-receipt.

Acceptance target: policy:testing.e2e.cross-environment:maximal:cross-environment-source-code-boundary+cross-environment-e2e-context+cross-environment-evidence-receipt.
Declared predicates: cross-environment-source-code-boundary: `environments` is nonempty (a string or array); cross-environment-e2e-context: `shared_cases` is nonempty (a string or array); cross-environment-evidence-receipt: `assume_platform_equivalence` equals false.
