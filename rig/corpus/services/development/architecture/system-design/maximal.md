# development.architecture.system-design — maximal

Maximal adds a replayable evidence receipt for system design. The evidence must preserve the components, trust_boundaries, failure_modes inputs that determined the result.

Trace the verdict to a second run against unchanged system design inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: system design configuration validation only; declared policy does not prove running system design behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.architecture.system-design:evidence-replay. Given the architecture.system-design binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
