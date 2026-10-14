# infrastructure.networking.dns-discovery — property-floor slice

Policy grade slice. This slice bounds dns discovery to networking.dns-discovery. It uses `dns-discovery-slice-property-floor` and checks service_records (nonempty): service records must name the concrete repository contract..

For dns discovery, choose a repository example that satisfies service_records at the property-floor floor, plus a failure where service records must name the concrete repository contract. is false. For dns discovery, wire `property-floor` to `rig-services/infrastructure.networking.dns-discovery.json` and keep its verdict on service_records; missing evidence is a named gap, with ceiling dns discovery configuration validation only; declared policy does not prove running dns discovery behavior. Choose a repository-owned check that observes dns discovery from rig-services/infrastructure.networking.dns-discovery.json..

Service-specific evidence cues:
Offer: Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.
minimal: service records — ["api.internal"].
mid: ttl seconds — 60.
maximal: hardcode ephemeral addresses — false.
