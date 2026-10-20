# infrastructure.environment-config.mcp-compatibility — mid

Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Policy grade, mid: Declare the protocol revision the server speaks. A mismatch fails the handshake, so record the exact revision. Cumulative with minimal. Binding checks: mcp-compatibility-source-code-boundary, mcp-compatibility-environment-config-context.

Acceptance target: policy:infrastructure.environment-config.mcp-compatibility:mid:mcp-compatibility-source-code-boundary+mcp-compatibility-environment-config-context.
Declared predicates: mcp-compatibility-source-code-boundary: `transport` is nonempty (a string or array); mcp-compatibility-environment-config-context: `protocol_revision` is nonempty (a string or array).
