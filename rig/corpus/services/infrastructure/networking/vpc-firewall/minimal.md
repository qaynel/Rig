# infrastructure.networking.vpc-firewall — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for vpc firewall. The minimal boundary for vpc firewall checks allowed_ingress (nonempty): allowed ingress must name the concrete repository contract.. Binding checks: vpc-firewall-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe networking.vpc-firewall; bind it to the input named in `rig-services/infrastructure.networking.vpc-firewall.json` and preserve the check's failure status. When adopting this in an existing repository, connect vpc firewall to the command that inspects allowed_ingress and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside networking.vpc-firewall as a failure.

Acceptance target: fixture:infrastructure.networking.vpc-firewall:policy-boundary. Given source-code is present and networking.vpc-firewall is selected, pass only when the repository binding evaluates networking.vpc-firewall and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern. The ceiling is vpc firewall configuration validation only; declared policy does not prove running vpc firewall behavior. Choose a repository-owned check that observes vpc firewall from rig-services/infrastructure.networking.vpc-firewall.json..

Service-specific evidence cues:
Offer: Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.
minimal: allowed ingress — ["443/tcp"].
mid: default action — "deny".
maximal: allow world admin access — false.
