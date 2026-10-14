# infrastructure.networking.vpc-firewall — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for vpc firewall. It checks allowed_ingress (nonempty): allowed ingress must name the concrete repository contract.. Binding checks: vpc-firewall-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe networking.vpc-firewall; bind it to the input named in `rig-services/infrastructure.networking.vpc-firewall.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside networking.vpc-firewall is a failure.

Acceptance target: fixture:infrastructure.networking.vpc-firewall:policy-boundary. Given source-code is present and networking.vpc-firewall is selected, pass only when the repository binding evaluates networking.vpc-firewall and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.

Owned scope: `networking.vpc-firewall`.

Offer: Allow only required ingress and retain a default-deny policy. Administrative network access must not be open to the world.

Input: `rig-services/infrastructure.networking.vpc-firewall.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: vpc firewall configuration validation only; declared policy does not prove running vpc firewall behavior. Select an approved repository-owned command to verify that behavior.

minimal: allowed ingress — ["443/tcp"].

mid: default action — "deny".

maximal: allow world admin access — false.
