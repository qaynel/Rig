# testing.unit.edge-boundary — maximal

Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Policy grade, maximal: Set normal-only tests to false. Tests that never leave the happy path miss boundary bugs, so include edges. Cumulative with minimal and mid. Binding checks: edge-boundary-source-code-boundary, edge-boundary-unit-context, edge-boundary-evidence-receipt.

Acceptance target: policy:testing.unit.edge-boundary:maximal:edge-boundary-source-code-boundary+edge-boundary-unit-context+edge-boundary-evidence-receipt.
Declared predicates: edge-boundary-source-code-boundary: `boundary_cases` is nonempty (a string or array); edge-boundary-unit-context: `invalid_cases` is nonempty (a string or array); edge-boundary-evidence-receipt: `normal_only_tests` equals false.
