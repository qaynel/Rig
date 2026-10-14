# infrastructure.networking.vpc-firewall — minimal

Minimal establishes a non-vacuous policy boundary for vpc firewall. It checks allowed_ingress (nonempty): allowed ingress must name the concrete repository contract..

Inspect a repository-owned command or existing native check that can observe networking.vpc-firewall; bind it to the input named in `rig-services/infrastructure.networking.vpc-firewall.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside networking.vpc-firewall is a failure.

Acceptance target: fixture:infrastructure.networking.vpc-firewall:policy-boundary. Given source-code is present and networking.vpc-firewall is selected, pass only when the repository binding evaluates networking.vpc-firewall and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern. A passing policy check does not establish runtime behavior.
