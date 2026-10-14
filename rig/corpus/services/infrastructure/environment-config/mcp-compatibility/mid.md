# infrastructure.environment-config.mcp-compatibility — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for mcp compatibility; it does not widen ownership beyond environment-config.mcp-compatibility. The context signals are protocol_revision. Binding checks: mcp-compatibility-environment-config-context.

Trace the verdict to the existing repository's mcp compatibility convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in environment-config under their own verdicts.

Acceptance target: fixture:infrastructure.environment-config.mcp-compatibility:repository-context. Given environment-config.mcp-compatibility has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent environment config concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Owned scope: `environment-config.mcp-compatibility`.

Offer: Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Input: `rig-services/infrastructure.environment-config.mcp-compatibility.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: mcp compatibility configuration validation only; declared policy does not prove running mcp compatibility behavior. Select an approved repository-owned command to verify that behavior.

minimal: transport — "stdio".

mid: protocol revision — "2025-03-26".

maximal: credentials in descriptor — false.
