# infrastructure.networking.dns-discovery — minimal

Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.

Policy grade remains the assurance level. `dns-discovery-source-code-boundary` requires service records to be nonempty. The good fixture provides api.internal; the bad fixture uses an empty service_records list and should fail this predicate.

This is a JSON configuration check on `rig-services/infrastructure.networking.dns-discovery.json`. A passing value does not prove a running dns discovery service is reachable or functioning. These predicates inspect the declared DNS configuration only. They do not resolve names, query an authoritative server, or measure propagation and cache behavior.
