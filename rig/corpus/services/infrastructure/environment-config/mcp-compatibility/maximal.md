# infrastructure.environment-config.mcp-compatibility — maximal

Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: mcp-compatibility-source-code-boundary, mcp-compatibility-environment-config-context, mcp-compatibility-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:infrastructure.environment-config.mcp-compatibility:maximal:mcp-compatibility-source-code-boundary+mcp-compatibility-environment-config-context+mcp-compatibility-evidence-receipt.

Declared predicates: mcp-compatibility-source-code-boundary: `transport` is nonempty (a string or array); mcp-compatibility-environment-config-context: `protocol_revision` is nonempty (a string or array); mcp-compatibility-evidence-receipt: `credentials_in_descriptor` equals false.
