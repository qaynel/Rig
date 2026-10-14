# infrastructure.container.service-mesh — maximal

Maximal adds a replayable evidence receipt for service mesh. The evidence must preserve the mesh_services, transport_security, allow_plaintext_fallback inputs that determined the result.

Trace the verdict to a second run against unchanged service mesh inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: service mesh configuration validation only; declared policy does not prove running service mesh behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.container.service-mesh:evidence-replay. Given the container.service-mesh binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
