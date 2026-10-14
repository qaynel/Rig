# dns discovery

Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.

Owned scope: `networking.dns-discovery`.

Offer: Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.

Input: `rig-services/infrastructure.networking.dns-discovery.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: dns discovery configuration validation only; declared policy does not prove running dns discovery behavior. Select an approved repository-owned command to verify that behavior.

minimal: service records — ["api.internal"].

mid: ttl seconds — 60.

maximal: hardcode ephemeral addresses — false.

