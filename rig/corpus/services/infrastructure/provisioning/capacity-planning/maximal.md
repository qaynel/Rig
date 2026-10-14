# infrastructure.provisioning.capacity-planning — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for capacity planning. The evidence must preserve the peak_requests_per_second, headroom_percent, ignore_growth_forecast inputs that determined the result. Binding checks: capacity-planning-evidence-receipt.

Inspect a second run against unchanged capacity planning inputs. Record the peak_requests_per_second, headroom_percent, ignore_growth_forecast inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this capacity planning result is stale. The ceiling remains: capacity planning configuration validation only; declared policy does not prove running capacity planning behavior. Choose a repository-owned check that observes capacity planning from rig-services/infrastructure.provisioning.capacity-planning.json.

Acceptance target: fixture:infrastructure.provisioning.capacity-planning:evidence-replay. Given the provisioning.capacity-planning binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Size capacity from a declared peak workload with explicit headroom and growth assumptions. A static configuration cannot prove that the hardware sustains the forecast.
minimal: peak requests per second — 100.
mid: headroom percent — 30.
maximal: ignore growth forecast — false.
