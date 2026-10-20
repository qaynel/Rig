# testing.e2e.cross-environment — minimal

Run the same behavioral cases in the required environments and record each result separately. One platform passing does not establish that filesystem or process semantics match another.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for cross environment. The minimal boundary for cross environment checks environments (nonempty): environments must name the concrete repository contract. Binding checks: cross-environment-source-code-boundary.

Use a repository-owned command or existing native check that can observe e2e.cross-environment; bind it to the input named in `rig-services/testing.e2e.cross-environment.json` and preserve the check's failure status. When adopting this in an existing repository, connect cross environment to the command that inspects environments and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside e2e.cross-environment as a failure.

Acceptance target: policy:testing.e2e.cross-environment:minimal:cross-environment-source-code-boundary.

Declared predicates: cross-environment-source-code-boundary: `environments` is nonempty (a string or array).
