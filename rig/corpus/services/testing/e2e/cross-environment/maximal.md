# testing.e2e.cross-environment — maximal

Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: cross-environment-source-code-boundary, cross-environment-e2e-context, cross-environment-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:testing.e2e.cross-environment:maximal:cross-environment-source-code-boundary+cross-environment-e2e-context+cross-environment-evidence-receipt.

Declared predicates: cross-environment-source-code-boundary: `environments` is nonempty (a string or array); cross-environment-e2e-context: `shared_cases` is nonempty (a string or array); cross-environment-evidence-receipt: `assume_platform_equivalence` equals false.
