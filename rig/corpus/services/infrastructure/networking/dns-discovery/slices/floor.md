# infrastructure.networking.dns-discovery — floor and mutation-floor slice

Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.

Policy grade slice for dns discovery. `dns-discovery-slice-floor` applies the same declared-field predicate as the minimal grade: service records must be nonempty. The floor rejects an empty service_records list; the good fixture supplies api.internal and the bad fixture removes every record.

The mutation-floor alias uses this same check ID and condition; it does not add a separate mutation test. Input: `rig-services/infrastructure.networking.dns-discovery.json`. These predicates inspect the declared DNS configuration only. They do not resolve names, query an authoritative server, or measure propagation and cache behavior.
