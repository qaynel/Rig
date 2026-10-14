# infrastructure.cost.utilization-analysis — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for utilization analysis. The evidence must preserve the observed_resources, observation_window_days, decide_from_single_peak inputs that determined the result. Binding checks: utilization-analysis-evidence-receipt.

Trace the verdict to a second run against unchanged utilization analysis inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: utilization analysis configuration validation only; declared policy does not prove running utilization analysis behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.cost.utilization-analysis:evidence-replay. Given the cost.utilization-analysis binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.

Owned scope: `cost.utilization-analysis`.

Offer: Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.

Input: `rig-services/infrastructure.cost.utilization-analysis.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: utilization analysis configuration validation only; declared policy does not prove running utilization analysis behavior. Select an approved repository-owned command to verify that behavior.

minimal: observed resources — ["cpu","memory"].

mid: observation window days — 7.

maximal: decide from single peak — false.
