# infrastructure.provisioning.capacity-planning — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for capacity planning. The evidence must preserve the peak_requests_per_second, headroom_percent, ignore_growth_forecast inputs that determined the result. Binding checks: capacity-planning-evidence-receipt.

Inspect a second run against unchanged capacity planning inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: capacity planning configuration validation only; declared policy does not prove running capacity planning behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.provisioning.capacity-planning:evidence-replay. Given the provisioning.capacity-planning binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Owned scope: `provisioning.capacity-planning`.

Offer: Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.

Input: `rig-services/infrastructure.provisioning.capacity-planning.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: capacity planning configuration validation only; declared policy does not prove running capacity planning behavior. Select an approved repository-owned command to verify that behavior.

minimal: peak requests per second — 100.

mid: headroom percent — 30.

maximal: ignore growth forecast — false.
