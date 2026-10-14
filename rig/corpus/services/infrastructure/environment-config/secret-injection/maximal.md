# infrastructure.environment-config.secret-injection — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for secret injection. The evidence must preserve the secret_references, delivery_mechanism, plaintext_secret_values inputs that determined the result. Binding checks: secret-injection-evidence-receipt.

Ground the decision in a second run against unchanged secret injection inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: secret injection configuration validation only; declared policy does not prove running secret injection behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.environment-config.secret-injection:evidence-replay. Given the runtime-secret-injection binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Owned scope: `runtime-secret-injection`, `secret-injection-wiring`.

Offer: Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Input: `rig-services/infrastructure.environment-config.secret-injection.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: secret injection configuration validation only; declared policy does not prove running secret injection behavior. Select an approved repository-owned command to verify that behavior.

minimal: secret references — ["vault://app/db"].

mid: delivery mechanism — "workload-identity".

maximal: plaintext secret values — false.
