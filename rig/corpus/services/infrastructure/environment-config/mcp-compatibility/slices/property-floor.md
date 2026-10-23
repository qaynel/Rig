# infrastructure.environment-config.mcp-compatibility — property-floor slice

Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Policy grade slice `mcp-compatibility-slice-property-floor`: Declare the MCP transport, such as stdio or http. The client cannot connect without it, so state the transport.
