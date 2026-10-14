# infrastructure.environment-config.mcp-compatibility — behavior-oracle slice

This slice bounds mcp compatibility to environment-config.mcp-compatibility. It uses `mcp-compatibility-slice-behavior-oracle` and checks transport (nonempty): transport must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.environment-config.mcp-compatibility.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than mcp compatibility configuration validation only; declared policy does not prove running mcp compatibility behavior. Select an approved repository-owned command to verify that behavior.
