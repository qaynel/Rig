# infrastructure.networking.load-balancer-ingress — identity

Policy grade: load balancer ingress owns networking.load-balancer-ingress. Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Keep sibling services in networking under their own verdicts. Start from the configured input at `rig-services/infrastructure.networking.load-balancer-ingress.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: load balancer ingress configuration validation only; declared policy does not prove running load balancer ingress behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.networking.load-balancer-ingress:policy-boundary. Given source-code is present and networking.load-balancer-ingress is selected, pass only when the repository binding evaluates networking.load-balancer-ingress and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern.

Service-specific evidence cues:
Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Owned scope: `networking.load-balancer-ingress`.

Offer: Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Input: `rig-services/infrastructure.networking.load-balancer-ingress.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: load balancer ingress configuration validation only; declared policy does not prove running load balancer ingress behavior. Select an approved repository-owned command to verify that behavior.

minimal: backend health path — "/health".

mid: request timeout ms — 5000.

maximal: expose admin route — false.
