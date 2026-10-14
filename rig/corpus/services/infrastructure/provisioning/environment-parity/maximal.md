# infrastructure.provisioning.environment-parity — maximal

Maximal adds a replayable evidence receipt for environment parity. The evidence must preserve the environments, intentional_differences, unrecorded_differences_allowed inputs that determined the result.

Inspect a second run against unchanged environment parity inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: environment parity configuration validation only; declared policy does not prove running environment parity behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.provisioning.environment-parity:evidence-replay. Given the provisioning.environment-parity binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
