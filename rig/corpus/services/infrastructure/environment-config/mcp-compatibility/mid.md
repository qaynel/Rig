# infrastructure.environment-config.mcp-compatibility — mid

Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: mcp-compatibility-source-code-boundary, mcp-compatibility-environment-config-context.

Trace the verdict to the existing repository's mcp compatibility convention, then name the source path or command that establishes it. For mcp compatibility, inspect the repository's actual spec, source, test, or configuration for protocol_revision; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring environment-config services outside the mcp compatibility decision for environment-config.mcp-compatibility.

Acceptance target: policy:infrastructure.environment-config.mcp-compatibility:mid:mcp-compatibility-source-code-boundary+mcp-compatibility-environment-config-context.

Declared predicates: mcp-compatibility-source-code-boundary: `transport` is nonempty (a string or array); mcp-compatibility-environment-config-context: `protocol_revision` is nonempty (a string or array).
