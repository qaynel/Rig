# mcp-compatibility

Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Owned scope: `environment-config.mcp-compatibility`. Input: `rig-services/infrastructure.environment-config.mcp-compatibility.json`.

Coverage ceiling: Configuration validation only, so it confirms the MCP transport, protocol revision and the embedded-credential flag are declared; it does not perform a handshake with a live server.

minimal: transport — "stdio". Declare the MCP transport, such as stdio or http. The client cannot connect without it, so state the transport.

mid: protocol revision — "2025-03-26". Declare the protocol revision the server speaks. A mismatch fails the handshake, so record the exact revision.

maximal: credentials in descriptor — false. Set credentials in the descriptor to false. A secret in a descriptor is committed and shared, so reference it by name instead.
