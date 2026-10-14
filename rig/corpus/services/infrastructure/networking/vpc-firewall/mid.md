# infrastructure.networking.vpc-firewall — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for vpc firewall; it does not widen ownership beyond networking.vpc-firewall. For vpc firewall, inspect these context signals: default_action. Binding checks: vpc-firewall-networking-context.

Tie acceptance to the existing repository's vpc firewall convention, then name the source path or command that establishes it. For vpc firewall, inspect the repository's actual spec, source, test, or configuration for default_action; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring networking services outside the vpc firewall decision for networking.vpc-firewall.

Acceptance target: fixture:infrastructure.networking.vpc-firewall:repository-context. Given networking.vpc-firewall has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent networking concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.
minimal: allowed ingress — ["443/tcp"].
mid: default action — "deny".
maximal: allow world admin access — false.
