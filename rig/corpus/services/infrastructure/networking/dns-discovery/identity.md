# infrastructure.networking.dns-discovery — identity

Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.

Policy grade: DNS discovery owns only `dns-discovery`. Publish stable service names with deliberate TTLs; hardcoded ephemeral addresses can leave clients using stale endpoints during failover.

The applicable surface is source-code with its declared input at `rig-services/infrastructure.networking.dns-discovery.json`; discovery preserves that path even when the JSON is malformed. The installed check evaluates the fields below, not live dns discovery behavior.

Disposition: executable configuration validation. Coverage ceiling: DNS configuration validation only. These predicates do not resolve names, query an authoritative server, or measure propagation and cache behavior.

The good fixture at `tests/fixtures/services/infrastructure.networking.dns-discovery/good/rig-services/infrastructure.networking.dns-discovery.json` passes the declared predicates. The bad fixture at `tests/fixtures/services/infrastructure.networking.dns-discovery/bad/rig-services/infrastructure.networking.dns-discovery.json` demonstrates the service records boundary. No adjacent networking service is part of this decision.
