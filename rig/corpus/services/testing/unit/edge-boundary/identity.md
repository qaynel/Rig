# testing.unit.edge-boundary — identity

Policy grade: edge boundary owns unit.edge-boundary. Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Keep sibling services in unit under their own verdicts. Inspect the configured input at `rig-services/testing.unit.edge-boundary.json`; malformed input is still attributed to that path.

Disposition: convention. Tie acceptance to the limit: edge boundary configuration validation only; declared policy does not prove running edge boundary behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.unit.edge-boundary:policy-boundary. Given source-code is present and unit.edge-boundary is selected, pass only when the repository binding evaluates unit.edge-boundary and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent unit concern.

Service-specific evidence cues:
Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Owned scope: `unit.edge-boundary`.

Offer: Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Input: `rig-services/testing.unit.edge-boundary.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: edge boundary configuration validation only; declared policy does not prove running edge boundary behavior. Select an approved repository-owned command to verify that behavior.

minimal: boundary cases — ["empty input","maximum length"].

mid: invalid cases — ["negative count"].

maximal: normal only tests — false.
