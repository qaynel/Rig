# testing.unit.edge-boundary — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for edge boundary. The evidence must preserve the boundary_cases, invalid_cases, normal_only_tests inputs that determined the result. Binding checks: edge-boundary-evidence-receipt.

Use a second run against unchanged edge boundary inputs. Record the boundary_cases, invalid_cases, normal_only_tests inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this edge boundary result is stale. The ceiling remains: edge boundary configuration validation only; declared policy does not prove running edge boundary behavior. Choose a repository-owned check that observes edge boundary from rig-services/testing.unit.edge-boundary.json.

Acceptance target: fixture:testing.unit.edge-boundary:evidence-replay. Given the unit.edge-boundary binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Probe the values immediately beside each accepted boundary as well as ordinary input. Empty, oversized and invalid cases expose contract holes that normal-path examples miss.
minimal: boundary cases — ["empty input","maximum length"].
mid: invalid cases — ["negative count"].
maximal: normal only tests — false.
