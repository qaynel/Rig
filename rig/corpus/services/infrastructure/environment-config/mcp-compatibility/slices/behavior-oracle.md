# infrastructure.environment-config.mcp-compatibility — behavior-oracle slice

Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Policy grade slice. This slice bounds mcp compatibility to environment-config.mcp-compatibility. It uses `mcp-compatibility-slice-behavior-oracle` and checks transport (nonempty): transport must name the concrete repository contract.