# infrastructure.networking.dns-discovery — property-floor slice

Policy grade slice. This slice bounds dns discovery to networking.dns-discovery. It uses `dns-discovery-slice-property-floor` and checks service_records (nonempty): service records must name the concrete repository contract..

Use a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.networking.dns-discovery.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than dns discovery configuration validation only; declared policy does not prove running dns discovery behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.

Owned scope: `networking.dns-discovery`.

Offer: Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.

Input: `rig-services/infrastructure.networking.dns-discovery.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: dns discovery configuration validation only; declared policy does not prove running dns discovery behavior. Select an approved repository-owned command to verify that behavior.

minimal: service records — ["api.internal"].

mid: ttl seconds — 60.

maximal: hardcode ephemeral addresses — false.
