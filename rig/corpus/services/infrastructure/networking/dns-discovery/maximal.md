# infrastructure.networking.dns-discovery — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for dns discovery. The evidence must preserve the service_records, ttl_seconds, hardcode_ephemeral_addresses inputs that determined the result. Binding checks: dns-discovery-evidence-receipt.

Read a second run against unchanged dns discovery inputs. Record the service_records, ttl_seconds, hardcode_ephemeral_addresses inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this dns discovery result is stale. The ceiling remains: dns discovery configuration validation only; declared policy does not prove running dns discovery behavior. Choose a repository-owned check that observes dns discovery from rig-services/infrastructure.networking.dns-discovery.json.

Acceptance target: fixture:infrastructure.networking.dns-discovery:evidence-replay. Given the networking.dns-discovery binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.
minimal: service records — ["api.internal"].
mid: ttl seconds — 60.
maximal: hardcode ephemeral addresses — false.
