# infrastructure.environment-config.mcp-compatibility — identity

Policy grade: mcp compatibility owns environment-config.mcp-compatibility. Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Keep neighboring environment-config services outside the mcp compatibility decision for environment-config.mcp-compatibility. Ground the decision in the configured input at `rig-services/infrastructure.environment-config.mcp-compatibility.json`; malformed input is still attributed to that path.

Disposition: convention. Use the limit: mcp compatibility configuration validation only; declared policy does not prove running mcp compatibility behavior. Choose a repository-owned check that observes mcp compatibility from rig-services/infrastructure.environment-config.mcp-compatibility.json.

Acceptance target: fixture:infrastructure.environment-config.mcp-compatibility:policy-boundary. Given source-code is present and environment-config.mcp-compatibility is selected, pass only when the repository binding evaluates environment-config.mcp-compatibility and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern.

Service-specific evidence cues:
Offer: Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.
minimal: transport — "stdio".
mid: protocol revision — "2025-03-26".
maximal: credentials in descriptor — false.
