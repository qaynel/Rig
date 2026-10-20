# testing.unit.edge-boundary — maximal

Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: edge-boundary-source-code-boundary, edge-boundary-unit-context, edge-boundary-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:testing.unit.edge-boundary:maximal:edge-boundary-source-code-boundary+edge-boundary-unit-context+edge-boundary-evidence-receipt.

Declared predicates: edge-boundary-source-code-boundary: `boundary_cases` is nonempty (a string or array); edge-boundary-unit-context: `invalid_cases` is nonempty (a string or array); edge-boundary-evidence-receipt: `normal_only_tests` equals false.
