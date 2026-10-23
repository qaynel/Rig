# DNS discovery

Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.

Publish stable service names with deliberate TTLs; hardcoded ephemeral addresses can leave clients using stale endpoints during failover.

Owned scope: `dns-discovery`.

Read the declared input at `rig-services/infrastructure.networking.dns-discovery.json`; retain its path in diagnostics when the file is malformed so the user can repair the right configuration.

Policy checks: service records is evaluated at minimal grade; `ttl_seconds` is evaluated at mid; and `hardcode_ephemeral_addresses` is evaluated at maximal.

Coverage ceiling: These predicates inspect the declared DNS configuration only. They do not resolve names, query an authoritative server, or measure propagation and cache behavior.

Use service_records for stable DNS names, ttl_seconds for the configured cache lifetime, and hardcode_ephemeral_addresses to reject literal ephemeral endpoints. The static checks validate these declared values; runtime DNS availability and propagation are outside their ceiling.
