# testing.unit.edge-boundary — identity

Policy grade: edge boundary owns unit.edge-boundary. Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Keep neighboring unit services outside the edge boundary decision for unit.edge-boundary. Inspect the configured input at `rig-services/testing.unit.edge-boundary.json`; malformed input is still attributed to that path.

Disposition: executable. Tie acceptance to the limit: edge boundary configuration validation only; declared policy does not prove running edge boundary behavior. Choose a repository-owned check that observes edge boundary from rig-services/testing.unit.edge-boundary.json.

Acceptance target: policy:testing.unit.edge-boundary:minimal:edge-boundary-source-code-boundary.

Declared predicates: edge-boundary-source-code-boundary: `boundary_cases` is nonempty (a string or array).
