# infrastructure.networking.load-balancer-ingress — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for load balancer ingress. It checks backend_health_path (nonempty): backend health path must name the concrete repository contract.. Binding checks: load-balancer-ingress-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe networking.load-balancer-ingress; bind it to the input named in `rig-services/infrastructure.networking.load-balancer-ingress.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside networking.load-balancer-ingress is a failure.

Acceptance target: fixture:infrastructure.networking.load-balancer-ingress:policy-boundary. Given source-code is present and networking.load-balancer-ingress is selected, pass only when the repository binding evaluates networking.load-balancer-ingress and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Owned scope: `networking.load-balancer-ingress`.

Offer: Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Input: `rig-services/infrastructure.networking.load-balancer-ingress.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: load balancer ingress configuration validation only; declared policy does not prove running load balancer ingress behavior. Select an approved repository-owned command to verify that behavior.

minimal: backend health path — "/health".

mid: request timeout ms — 5000.

maximal: expose admin route — false.
