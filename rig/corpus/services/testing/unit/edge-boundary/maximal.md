# testing.unit.edge-boundary — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for edge boundary. The evidence must preserve the boundary_cases, invalid_cases, normal_only_tests inputs that determined the result. Binding checks: edge-boundary-evidence-receipt.

Use a second run against unchanged edge boundary inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: edge boundary configuration validation only; declared policy does not prove running edge boundary behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.unit.edge-boundary:evidence-replay. Given the unit.edge-boundary binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Owned scope: `unit.edge-boundary`.

Offer: Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.

Input: `rig-services/testing.unit.edge-boundary.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: edge boundary configuration validation only; declared policy does not prove running edge boundary behavior. Select an approved repository-owned command to verify that behavior.

minimal: boundary cases — ["empty input","maximum length"].

mid: invalid cases — ["negative count"].

maximal: normal only tests — false.
