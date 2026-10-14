# infrastructure.provisioning.capacity-planning — maximal

Maximal adds a replayable evidence receipt for capacity planning. The evidence must preserve the peak_requests_per_second, headroom_percent, ignore_growth_forecast inputs that determined the result.

Inspect a second run against unchanged capacity planning inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: capacity planning configuration validation only; declared policy does not prove running capacity planning behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.provisioning.capacity-planning:evidence-replay. Given the provisioning.capacity-planning binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
