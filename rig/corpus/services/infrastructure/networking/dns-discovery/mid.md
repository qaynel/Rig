# infrastructure.networking.dns-discovery — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for dns discovery; it does not widen ownership beyond networking.dns-discovery. For dns discovery, inspect these context signals: ttl_seconds. Binding checks: dns-discovery-networking-context.

Tie acceptance to the existing repository's dns discovery convention, then name the source path or command that establishes it. For dns discovery, inspect the repository's actual spec, source, test, or configuration for ttl_seconds; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring networking services outside the dns discovery decision for networking.dns-discovery.

Acceptance target: fixture:infrastructure.networking.dns-discovery:repository-context. Given networking.dns-discovery has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent networking concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.
minimal: service records — ["api.internal"].
mid: ttl seconds — 60.
maximal: hardcode ephemeral addresses — false.
