# infrastructure.environment-config.config-drift — maximal

Maximal adds a replayable evidence receipt for config drift. The evidence must preserve the authoritative_sources, comparison_schedule, silent_drift_acceptance inputs that determined the result.

Tie acceptance to a second run against unchanged config drift inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: config drift configuration validation only; declared policy does not prove running config drift behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.environment-config.config-drift:evidence-replay. Given the environment-config.config-drift binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
