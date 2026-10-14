# testing.unit.edge-boundary — floor and mutation-floor slice

Policy grade slice. This slice bounds edge boundary to unit.edge-boundary. It uses `edge-boundary-slice-floor` and checks boundary_cases (nonempty): boundary cases must name the concrete repository contract..

Anchor the review on a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.unit.edge-boundary.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than edge boundary configuration validation only; declared policy does not prove running edge boundary behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Owned scope: `unit.edge-boundary`.

Offer: Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Input: `rig-services/testing.unit.edge-boundary.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: edge boundary configuration validation only; declared policy does not prove running edge boundary behavior. Select an approved repository-owned command to verify that behavior.

minimal: boundary cases — ["empty input","maximum length"].

mid: invalid cases — ["negative count"].

maximal: normal only tests — false.
