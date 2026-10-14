# infrastructure.environment-config.config-drift — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for config drift. The evidence must preserve the authoritative_sources, comparison_schedule, silent_drift_acceptance inputs that determined the result. Binding checks: config-drift-evidence-receipt.

Tie acceptance to a second run against unchanged config drift inputs. Record the authoritative_sources, comparison_schedule, silent_drift_acceptance inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this config drift result is stale. The ceiling remains: config drift configuration validation only; declared policy does not prove running config drift behavior. Choose a repository-owned check that observes config drift from rig-services/infrastructure.environment-config.config-drift.json.

Acceptance target: fixture:infrastructure.environment-config.config-drift:evidence-replay. Given the environment-config.config-drift binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.
minimal: authoritative sources — ["config/production.json"].
mid: comparison schedule — "daily".
maximal: silent drift acceptance — false.
