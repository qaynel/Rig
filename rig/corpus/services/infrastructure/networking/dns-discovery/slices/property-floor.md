# infrastructure.networking.dns-discovery — property-floor slice

Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.

Policy grade slice for dns discovery. `dns-discovery-slice-property-floor` requires service records to be nonempty. The property floor currently checks only that service_records is nonempty. It does not test record uniqueness, TTL behavior, or resolution.

No runtime property is measured by this predicate. Input: `rig-services/infrastructure.networking.dns-discovery.json`. These predicates inspect the declared DNS configuration only. They do not resolve names, query an authoritative server, or measure propagation and cache behavior.
