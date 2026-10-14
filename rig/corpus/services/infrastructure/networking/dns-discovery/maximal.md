# infrastructure.networking.dns-discovery — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for dns discovery. The evidence must preserve the service_records, ttl_seconds, hardcode_ephemeral_addresses inputs that determined the result. Binding checks: dns-discovery-evidence-receipt.

Read a second run against unchanged dns discovery inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: dns discovery configuration validation only; declared policy does not prove running dns discovery behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.networking.dns-discovery:evidence-replay. Given the networking.dns-discovery binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.

Owned scope: `networking.dns-discovery`.

Offer: Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.

Input: `rig-services/infrastructure.networking.dns-discovery.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: dns discovery configuration validation only; declared policy does not prove running dns discovery behavior. Select an approved repository-owned command to verify that behavior.

minimal: service records — ["api.internal"].

mid: ttl seconds — 60.

maximal: hardcode ephemeral addresses — false.
