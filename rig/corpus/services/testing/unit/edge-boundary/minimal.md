# testing.unit.edge-boundary — minimal

Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for edge boundary. The minimal boundary for edge boundary checks boundary_cases (nonempty): boundary cases must name the concrete repository contract. Binding checks: edge-boundary-source-code-boundary.

Read a repository-owned command or existing native check that can observe unit.edge-boundary; bind it to the input named in `rig-services/testing.unit.edge-boundary.json` and preserve the check's failure status. When adopting this in an existing repository, connect edge boundary to the command that inspects boundary_cases and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside unit.edge-boundary as a failure.

Acceptance target: policy:testing.unit.edge-boundary:minimal:edge-boundary-source-code-boundary.

Declared predicates: edge-boundary-source-code-boundary: `boundary_cases` is nonempty (a string or array).
