# infrastructure.networking.dns-discovery — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for dns discovery; it does not widen ownership beyond networking.dns-discovery. The context signals are ttl_seconds. Binding checks: dns-discovery-networking-context.

Tie acceptance to the existing repository's dns discovery convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in networking under their own verdicts.

Acceptance target: fixture:infrastructure.networking.dns-discovery:repository-context. Given networking.dns-discovery has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent networking concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.

Owned scope: `networking.dns-discovery`.

Offer: Publish service discovery records with a deliberate TTL and stable ownership. Hardcoding ephemeral addresses bypasses discovery and creates avoidable failover failures.

Input: `rig-services/infrastructure.networking.dns-discovery.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: dns discovery configuration validation only; declared policy does not prove running dns discovery behavior. Select an approved repository-owned command to verify that behavior.

minimal: service records — ["api.internal"].

mid: ttl seconds — 60.

maximal: hardcode ephemeral addresses — false.
