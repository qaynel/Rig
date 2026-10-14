# infrastructure.container.service-mesh — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for service mesh. The evidence must preserve the mesh_services, transport_security, allow_plaintext_fallback inputs that determined the result. Binding checks: service-mesh-evidence-receipt.

Trace the verdict to a second run against unchanged service mesh inputs. Record the mesh_services, transport_security, allow_plaintext_fallback inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this service mesh result is stale. The ceiling remains: service mesh configuration validation only; declared policy does not prove running service mesh behavior. Choose a repository-owned check that observes service mesh from rig-services/infrastructure.container.service-mesh.json.

Acceptance target: fixture:infrastructure.container.service-mesh:evidence-replay. Given the container.service-mesh binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Enumerate mesh participants and require authenticated encrypted service traffic. Plaintext fallback undermines the declared mesh boundary and must not be implicit.
minimal: mesh services — ["api","worker"].
mid: transport security — "mutual-tls".
maximal: allow plaintext fallback — false.
