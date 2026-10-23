# testing.unit.edge-boundary — mid

Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Policy grade, mid: List the invalid inputs, such as empty and oversized. Untested invalid input crashes in production, so add them. Cumulative with minimal. Binding checks: edge-boundary-source-code-boundary, edge-boundary-unit-context.

Acceptance target: policy:testing.unit.edge-boundary:mid:edge-boundary-source-code-boundary+edge-boundary-unit-context.
Declared predicates: edge-boundary-source-code-boundary: `boundary_cases` is nonempty (a string or array); edge-boundary-unit-context: `invalid_cases` is nonempty (a string or array).
