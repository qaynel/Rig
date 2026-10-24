# testing.unit.edge-boundary — minimal

Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Policy grade, minimal: List the values on each side of every boundary. Normal inputs miss contract holes, so name the edge values. Binding checks: edge-boundary-source-code-boundary.

Acceptance target: policy:testing.unit.edge-boundary:minimal:edge-boundary-source-code-boundary.
Declared predicates: edge-boundary-source-code-boundary: `boundary_cases` is nonempty (a string or array).
