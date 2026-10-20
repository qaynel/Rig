# infrastructure.environment-config.mcp-compatibility — minimal

Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for mcp compatibility. The minimal boundary for mcp compatibility checks transport (nonempty): transport must name the concrete repository contract. Binding checks: mcp-compatibility-source-code-boundary.

Start from a repository-owned command or existing native check that can observe environment-config.mcp-compatibility; bind it to the input named in `rig-services/infrastructure.environment-config.mcp-compatibility.json` and preserve the check's failure status. When adopting this in an existing repository, connect mcp compatibility to the command that inspects transport and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside environment-config.mcp-compatibility as a failure.

Acceptance target: policy:infrastructure.environment-config.mcp-compatibility:minimal:mcp-compatibility-source-code-boundary.

Declared predicates: mcp-compatibility-source-code-boundary: `transport` is nonempty (a string or array).
