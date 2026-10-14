# infrastructure.environment-config.mcp-compatibility — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for mcp compatibility. The evidence must preserve the transport, protocol_revision, credentials_in_descriptor inputs that determined the result. Binding checks: mcp-compatibility-evidence-receipt.

Anchor the review on a second run against unchanged mcp compatibility inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: mcp compatibility configuration validation only; declared policy does not prove running mcp compatibility behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.environment-config.mcp-compatibility:evidence-replay. Given the environment-config.mcp-compatibility binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Owned scope: `environment-config.mcp-compatibility`.

Offer: Declare the MCP transport and protocol contract without embedding credential values. Descriptor checks do not establish that a live server can complete the protocol handshake.

Input: `rig-services/infrastructure.environment-config.mcp-compatibility.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: mcp compatibility configuration validation only; declared policy does not prove running mcp compatibility behavior. Select an approved repository-owned command to verify that behavior.

minimal: transport — "stdio".

mid: protocol revision — "2025-03-26".

maximal: credentials in descriptor — false.
