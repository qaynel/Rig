# testing.unit.edge-boundary — maximal

Maximal adds a replayable evidence receipt for edge boundary. The evidence must preserve the boundary_cases, invalid_cases, normal_only_tests inputs that determined the result.

Use a second run against unchanged edge boundary inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: edge boundary configuration validation only; declared policy does not prove running edge boundary behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.unit.edge-boundary:evidence-replay. Given the unit.edge-boundary binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
