# infrastructure.networking.dns-discovery — mid

Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.

Policy grade remains unchanged at mid. `dns-discovery-networking-context` checks `ttl_seconds` with the `minimum` predicate at 60. A TTL of 60 seconds meets the declared floor; it does not establish that a repository or resolver requires that value.

The value comes from `rig-services/infrastructure.networking.dns-discovery.json`; this is configuration validation, not a claim that the repository follows a discovered convention. These predicates inspect the declared DNS configuration only. They do not resolve names, query an authoritative server, or measure propagation and cache behavior.
