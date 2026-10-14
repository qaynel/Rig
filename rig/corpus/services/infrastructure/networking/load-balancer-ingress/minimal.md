# infrastructure.networking.load-balancer-ingress — minimal

Minimal establishes a non-vacuous policy boundary for load balancer ingress. It checks backend_health_path (nonempty): backend health path must name the concrete repository contract..

Anchor the review on a repository-owned command or existing native check that can observe networking.load-balancer-ingress; bind it to the input named in `rig-services/infrastructure.networking.load-balancer-ingress.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside networking.load-balancer-ingress is a failure.

Acceptance target: fixture:infrastructure.networking.load-balancer-ingress:policy-boundary. Given source-code is present and networking.load-balancer-ingress is selected, pass only when the repository binding evaluates networking.load-balancer-ingress and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern. A passing policy check does not establish runtime behavior.
