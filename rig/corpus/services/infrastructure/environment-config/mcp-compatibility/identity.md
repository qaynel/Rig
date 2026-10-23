# infrastructure.environment-config.mcp-compatibility — identity

Policy grade: mcp-compatibility owns environment-config.mcp-compatibility. Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Input: `rig-services/infrastructure.environment-config.mcp-compatibility.json`. Configuration validation only, so it confirms the MCP transport, protocol revision and the embedded-credential flag are declared; it does not perform a handshake with a live server.

Disposition: executable.
Acceptance target: policy:infrastructure.environment-config.mcp-compatibility:minimal:mcp-compatibility-source-code-boundary.
Declared predicates: mcp-compatibility-source-code-boundary: `transport` is nonempty (a string or array).
