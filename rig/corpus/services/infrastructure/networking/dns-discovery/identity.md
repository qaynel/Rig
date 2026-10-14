# infrastructure.networking.dns-discovery — identity

Policy grade: dns discovery owns networking.dns-discovery. Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.

Keep neighboring networking services outside the dns discovery decision for networking.dns-discovery. Trace the verdict to the configured input at `rig-services/infrastructure.networking.dns-discovery.json`; malformed input is still attributed to that path.

Disposition: convention. Anchor the review on the limit: dns discovery configuration validation only; declared policy does not prove running dns discovery behavior. Choose a repository-owned check that observes dns discovery from rig-services/infrastructure.networking.dns-discovery.json.

Acceptance target: fixture:infrastructure.networking.dns-discovery:policy-boundary. Given source-code is present and networking.dns-discovery is selected, pass only when the repository binding evaluates networking.dns-discovery and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern.

Service-specific evidence cues:
Offer: Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.
minimal: service records — ["api.internal"].
mid: ttl seconds — 60.
maximal: hardcode ephemeral addresses — false.
