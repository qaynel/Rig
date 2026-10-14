# infrastructure.networking.load-balancer-ingress — behavior-oracle slice

Policy grade slice. This slice bounds load balancer ingress to networking.load-balancer-ingress. It uses `load-balancer-ingress-slice-behavior-oracle` and checks backend_health_path (nonempty): backend health path must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.networking.load-balancer-ingress.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than load balancer ingress configuration validation only; declared policy does not prove running load balancer ingress behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Owned scope: `networking.load-balancer-ingress`.

Offer: Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Input: `rig-services/infrastructure.networking.load-balancer-ingress.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: load balancer ingress configuration validation only; declared policy does not prove running load balancer ingress behavior. Select an approved repository-owned command to verify that behavior.

minimal: backend health path — "/health".

mid: request timeout ms — 5000.

maximal: expose admin route — false.
