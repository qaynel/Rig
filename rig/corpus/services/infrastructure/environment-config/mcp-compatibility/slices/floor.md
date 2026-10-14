# infrastructure.environment-config.mcp-compatibility — floor and mutation-floor slice

Policy grade slice. This slice bounds mcp compatibility to environment-config.mcp-compatibility. It uses `mcp-compatibility-slice-floor` and checks transport (nonempty): transport must name the concrete repository contract..

Read a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.environment-config.mcp-compatibility.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than mcp compatibility configuration validation only; declared policy does not prove running mcp compatibility behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Owned scope: `environment-config.mcp-compatibility`.

Offer: Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Input: `rig-services/infrastructure.environment-config.mcp-compatibility.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: mcp compatibility configuration validation only; declared policy does not prove running mcp compatibility behavior. Select an approved repository-owned command to verify that behavior.

minimal: transport — "stdio".

mid: protocol revision — "2025-03-26".

maximal: credentials in descriptor — false.
