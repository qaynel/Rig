# testing.unit.edge-boundary — identity

Policy grade: edge-boundary owns unit.edge-boundary. Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Input: `rig-services/testing.unit.edge-boundary.json`. Configuration validation only, so it confirms boundary cases, invalid cases and the normal-only flag are declared; it does not run the tests.

Disposition: executable.
Acceptance target: policy:testing.unit.edge-boundary:minimal:edge-boundary-source-code-boundary.
Declared predicates: edge-boundary-source-code-boundary: `boundary_cases` is nonempty (a string or array).
