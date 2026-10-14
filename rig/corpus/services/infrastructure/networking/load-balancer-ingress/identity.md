# infrastructure.networking.load-balancer-ingress — identity

Policy grade: load balancer ingress owns networking.load-balancer-ingress. Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Keep neighboring networking services outside the load balancer ingress decision for networking.load-balancer-ingress. Start from the configured input at `rig-services/infrastructure.networking.load-balancer-ingress.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: load balancer ingress configuration validation only; declared policy does not prove running load balancer ingress behavior. Choose a repository-owned check that observes load balancer ingress from rig-services/infrastructure.networking.load-balancer-ingress.json.

Acceptance target: fixture:infrastructure.networking.load-balancer-ingress:policy-boundary. Given source-code is present and networking.load-balancer-ingress is selected, pass only when the repository binding evaluates networking.load-balancer-ingress and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern.

Service-specific evidence cues:
Offer: Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.
minimal: backend health path — "/health".
mid: request timeout ms — 5000.
maximal: expose admin route — false.
