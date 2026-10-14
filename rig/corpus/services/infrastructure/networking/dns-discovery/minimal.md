# infrastructure.networking.dns-discovery — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for dns discovery. The minimal boundary for dns discovery checks service_records (nonempty): service records must name the concrete repository contract.. Binding checks: dns-discovery-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe networking.dns-discovery; bind it to the input named in `rig-services/infrastructure.networking.dns-discovery.json` and preserve the check's failure status. When adopting this in an existing repository, connect dns discovery to the command that inspects service_records and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside networking.dns-discovery as a failure.

Acceptance target: fixture:infrastructure.networking.dns-discovery:policy-boundary. Given source-code is present and networking.dns-discovery is selected, pass only when the repository binding evaluates networking.dns-discovery and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern. The ceiling is dns discovery configuration validation only; declared policy does not prove running dns discovery behavior. Choose a repository-owned check that observes dns discovery from rig-services/infrastructure.networking.dns-discovery.json..

Service-specific evidence cues:
Offer: Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.
minimal: service records — ["api.internal"].
mid: ttl seconds — 60.
maximal: hardcode ephemeral addresses — false.
