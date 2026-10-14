# infrastructure.networking.vpc-firewall — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for vpc firewall; it does not widen ownership beyond networking.vpc-firewall. The context signals are default_action. Binding checks: vpc-firewall-networking-context.

Tie acceptance to the existing repository's vpc firewall convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in networking under their own verdicts.

Acceptance target: fixture:infrastructure.networking.vpc-firewall:repository-context. Given networking.vpc-firewall has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent networking concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.

Owned scope: `networking.vpc-firewall`.

Offer: Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.

Input: `rig-services/infrastructure.networking.vpc-firewall.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: vpc firewall configuration validation only; declared policy does not prove running vpc firewall behavior. Select an approved repository-owned command to verify that behavior.

minimal: allowed ingress — ["443/tcp"].

mid: default action — "deny".

maximal: allow world admin access — false.
