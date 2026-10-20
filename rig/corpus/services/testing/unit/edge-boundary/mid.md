# testing.unit.edge-boundary — mid

Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: edge-boundary-source-code-boundary, edge-boundary-unit-context.

Ground the decision in the existing repository's edge boundary convention, then name the source path or command that establishes it. For edge boundary, inspect the repository's actual spec, source, test, or configuration for invalid_cases; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring unit services outside the edge boundary decision for unit.edge-boundary.

Acceptance target: policy:testing.unit.edge-boundary:mid:edge-boundary-source-code-boundary+edge-boundary-unit-context.

Declared predicates: edge-boundary-source-code-boundary: `boundary_cases` is nonempty (a string or array); edge-boundary-unit-context: `invalid_cases` is nonempty (a string or array).
