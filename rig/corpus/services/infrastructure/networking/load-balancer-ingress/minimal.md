# infrastructure.networking.load-balancer-ingress — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for load balancer ingress. The minimal boundary for load balancer ingress checks backend_health_path (nonempty): backend health path must name the concrete repository contract.. Binding checks: load-balancer-ingress-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe networking.load-balancer-ingress; bind it to the input named in `rig-services/infrastructure.networking.load-balancer-ingress.json` and preserve the check's failure status. When adopting this in an existing repository, connect load balancer ingress to the command that inspects backend_health_path and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside networking.load-balancer-ingress as a failure.

Acceptance target: fixture:infrastructure.networking.load-balancer-ingress:policy-boundary. Given source-code is present and networking.load-balancer-ingress is selected, pass only when the repository binding evaluates networking.load-balancer-ingress and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern. The ceiling is load balancer ingress configuration validation only; declared policy does not prove running load balancer ingress behavior. Choose a repository-owned check that observes load balancer ingress from rig-services/infrastructure.networking.load-balancer-ingress.json..

Service-specific evidence cues:
Offer: Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.
minimal: backend health path — "/health".
mid: request timeout ms — 5000.
maximal: expose admin route — false.
