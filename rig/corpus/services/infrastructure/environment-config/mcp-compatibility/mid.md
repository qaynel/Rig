# infrastructure.environment-config.mcp-compatibility — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for mcp compatibility; it does not widen ownership beyond environment-config.mcp-compatibility. For mcp compatibility, inspect these context signals: protocol_revision. Binding checks: mcp-compatibility-environment-config-context.

Trace the verdict to the existing repository's mcp compatibility convention, then name the source path or command that establishes it. For mcp compatibility, inspect the repository's actual spec, source, test, or configuration for protocol_revision; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring environment-config services outside the mcp compatibility decision for environment-config.mcp-compatibility.

Acceptance target: fixture:infrastructure.environment-config.mcp-compatibility:repository-context. Given environment-config.mcp-compatibility has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent environment config concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.
minimal: transport — "stdio".
mid: protocol revision — "2025-03-26".
maximal: credentials in descriptor — false.
