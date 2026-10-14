# infrastructure.cost.utilization-analysis — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for utilization analysis. The evidence must preserve the observed_resources, observation_window_days, decide_from_single_peak inputs that determined the result. Binding checks: utilization-analysis-evidence-receipt.

Trace the verdict to a second run against unchanged utilization analysis inputs. Record the observed_resources, observation_window_days, decide_from_single_peak inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this utilization analysis result is stale. The ceiling remains: utilization analysis configuration validation only; declared policy does not prove running utilization analysis behavior. Choose a repository-owned check that observes utilization analysis from rig-services/infrastructure.cost.utilization-analysis.json.

Acceptance target: fixture:infrastructure.cost.utilization-analysis:evidence-replay. Given the cost.utilization-analysis binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Measure utilization over a representative window and inspect multiple constrained resources. A single peak does not establish steady-state capacity or an opportunity to reduce it.
minimal: observed resources — ["cpu","memory"].
mid: observation window days — 7.
maximal: decide from single peak — false.
