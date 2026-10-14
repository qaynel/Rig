# edge boundary

Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Owned scope: `unit.edge-boundary`.

Offer: Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Input: `rig-services/testing.unit.edge-boundary.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: edge boundary configuration validation only; declared policy does not prove running edge boundary behavior. Select an approved repository-owned command to verify that behavior.

minimal: boundary cases — ["empty input","maximum length"].

mid: invalid cases — ["negative count"].

maximal: normal only tests — false.

