# infrastructure.environment-config.secret-injection — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for secret injection. The evidence must preserve the secret_references, delivery_mechanism, plaintext_secret_values inputs that determined the result. Binding checks: secret-injection-evidence-receipt.

Ground the decision in a second run against unchanged secret injection inputs. Record the secret_references, delivery_mechanism, plaintext_secret_values inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this secret injection result is stale. The ceiling remains: secret injection configuration validation only; declared policy does not prove running secret injection behavior. Choose a repository-owned check that observes secret injection from rig-services/infrastructure.environment-config.secret-injection.json.

Acceptance target: fixture:infrastructure.environment-config.secret-injection:evidence-replay. Given the runtime-secret-injection binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.
minimal: secret references — ["vault://app/db"].
mid: delivery mechanism — "workload-identity".
maximal: plaintext secret values — false.
