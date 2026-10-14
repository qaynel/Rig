# infrastructure.environment-config.mcp-compatibility — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for mcp compatibility. The minimal boundary for mcp compatibility checks transport (nonempty): transport must name the concrete repository contract.. Binding checks: mcp-compatibility-source-code-boundary.

Start from a repository-owned command or existing native check that can observe environment-config.mcp-compatibility; bind it to the input named in `rig-services/infrastructure.environment-config.mcp-compatibility.json` and preserve the check's failure status. When adopting this in an existing repository, connect mcp compatibility to the command that inspects transport and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside environment-config.mcp-compatibility as a failure.

Acceptance target: fixture:infrastructure.environment-config.mcp-compatibility:policy-boundary. Given source-code is present and environment-config.mcp-compatibility is selected, pass only when the repository binding evaluates environment-config.mcp-compatibility and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern. The ceiling is mcp compatibility configuration validation only; declared policy does not prove running mcp compatibility behavior. Choose a repository-owned check that observes mcp compatibility from rig-services/infrastructure.environment-config.mcp-compatibility.json..

Service-specific evidence cues:
Offer: Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.
minimal: transport — "stdio".
mid: protocol revision — "2025-03-26".
maximal: credentials in descriptor — false.
