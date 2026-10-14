# infrastructure.scaling-reliability.chaos-engineering — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for chaos engineering. The evidence must preserve the fault_scenarios, stop_conditions, production_experiment_without_approval inputs that determined the result. Binding checks: chaos-engineering-evidence-receipt.

Tie acceptance to a second run against unchanged chaos engineering inputs. Record the fault_scenarios, stop_conditions, production_experiment_without_approval inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this chaos engineering result is stale. The ceiling remains: chaos engineering configuration validation only; declared policy does not prove running chaos engineering behavior. Choose a repository-owned check that observes chaos engineering from rig-services/infrastructure.scaling-reliability.chaos-engineering.json.

Acceptance target: fixture:infrastructure.scaling-reliability.chaos-engineering:evidence-replay. Given the scaling-reliability.chaos-engineering binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Choose faults that test a resilience assumption and define immediate stop conditions. Production chaos requires explicit approval and measured safeguards.
minimal: fault scenarios — ["worker unavailable"].
mid: stop conditions — ["error budget exhausted"].
maximal: production experiment without approval — false.
