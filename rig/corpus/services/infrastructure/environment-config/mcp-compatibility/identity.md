# infrastructure.environment-config.mcp-compatibility — identity

Policy grade: mcp compatibility owns environment-config.mcp-compatibility. Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Keep neighboring environment-config services outside the mcp compatibility decision for environment-config.mcp-compatibility. Ground the decision in the configured input at `rig-services/infrastructure.environment-config.mcp-compatibility.json`; malformed input is still attributed to that path.

Disposition: executable. Use the limit: mcp compatibility configuration validation only; declared policy does not prove running mcp compatibility behavior. Choose a repository-owned check that observes mcp compatibility from rig-services/infrastructure.environment-config.mcp-compatibility.json.

Acceptance target: policy:infrastructure.environment-config.mcp-compatibility:minimal:mcp-compatibility-source-code-boundary.

Declared predicates: mcp-compatibility-source-code-boundary: `transport` is nonempty (a string or array).
