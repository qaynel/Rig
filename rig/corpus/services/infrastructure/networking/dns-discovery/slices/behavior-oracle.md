# infrastructure.networking.dns-discovery — behavior-oracle slice

Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.

Policy grade slice for dns discovery. `dns-discovery-slice-behavior-oracle` applies the nonempty service_records predicate to the declared JSON input. Despite the slice name, this check is not a DNS behavior oracle. It repeats the nonempty service_records predicate against configuration and does not query DNS.

This slice does not observe runtime behavior; its result is limited to the configuration field at `rig-services/infrastructure.networking.dns-discovery.json`. These predicates inspect the declared DNS configuration only. They do not resolve names, query an authoritative server, or measure propagation and cache behavior.
