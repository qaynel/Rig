# infrastructure.environment-config.secret-injection — maximal

Maximal adds a replayable evidence receipt for secret injection. The evidence must preserve the secret_references, delivery_mechanism, plaintext_secret_values inputs that determined the result.

Ground the decision in a second run against unchanged secret injection inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: secret injection configuration validation only; declared policy does not prove running secret injection behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.environment-config.secret-injection:evidence-replay. Given the runtime-secret-injection binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
