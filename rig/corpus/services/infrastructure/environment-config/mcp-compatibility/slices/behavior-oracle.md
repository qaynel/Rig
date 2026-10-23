# infrastructure.environment-config.mcp-compatibility — behavior-oracle slice

Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Policy grade slice `mcp-compatibility-slice-behavior-oracle`: Declare the MCP transport, such as stdio or http. The client cannot connect without it, so state the transport. Despite its name this slice is not a behavior oracle: it confirms the MCP transport, protocol revision and the embedded-credential flag are declared; it does not perform a handshake with a live server.
