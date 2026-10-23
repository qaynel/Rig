# infrastructure.networking.dns-discovery — maximal

Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.

Maximal still provides Policy grade assurance. `dns-discovery-evidence-receipt` checks `hardcode_ephemeral_addresses`: ephemeral address literals are disallowed. The checks enforce each DNS field but do not create or replay an evidence receipt.

The installed predicate does not produce a replayable evidence receipt. It checks the JSON at `rig-services/infrastructure.networking.dns-discovery.json` only. These predicates inspect the declared DNS configuration only. They do not resolve names, query an authoritative server, or measure propagation and cache behavior.
