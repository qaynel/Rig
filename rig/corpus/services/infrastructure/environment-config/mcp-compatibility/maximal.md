# infrastructure.environment-config.mcp-compatibility — maximal

Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Policy grade, maximal: Set credentials in the descriptor to false. A secret in a descriptor is committed and shared, so reference it by name instead. Cumulative with minimal and mid. Binding checks: mcp-compatibility-source-code-boundary, mcp-compatibility-environment-config-context, mcp-compatibility-evidence-receipt.

Acceptance target: policy:infrastructure.environment-config.mcp-compatibility:maximal:mcp-compatibility-source-code-boundary+mcp-compatibility-environment-config-context+mcp-compatibility-evidence-receipt.
Declared predicates: mcp-compatibility-source-code-boundary: `transport` is nonempty (a string or array); mcp-compatibility-environment-config-context: `protocol_revision` is nonempty (a string or array); mcp-compatibility-evidence-receipt: `credentials_in_descriptor` equals false.
