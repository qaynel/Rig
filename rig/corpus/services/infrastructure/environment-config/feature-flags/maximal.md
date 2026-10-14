# infrastructure.environment-config.feature-flags — maximal

Maximal adds a replayable evidence receipt for feature flags. The evidence must preserve the flag_names, rollback_owner, permanent_unowned_flags inputs that determined the result.

Tie acceptance to a second run against unchanged feature flags inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: feature flags configuration validation only; declared policy does not prove running feature flags behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.environment-config.feature-flags:evidence-replay. Given the environment-config.feature-flags binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
