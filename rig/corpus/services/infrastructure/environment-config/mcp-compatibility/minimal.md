# infrastructure.environment-config.mcp-compatibility — minimal

Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Policy grade, minimal: Declare the MCP transport, such as stdio or http. The client cannot connect without it, so state the transport. Binding checks: mcp-compatibility-source-code-boundary.

Acceptance target: policy:infrastructure.environment-config.mcp-compatibility:minimal:mcp-compatibility-source-code-boundary.
Declared predicates: mcp-compatibility-source-code-boundary: `transport` is nonempty (a string or array).
