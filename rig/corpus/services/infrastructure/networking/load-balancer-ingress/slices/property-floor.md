# infrastructure.networking.load-balancer-ingress — property-floor slice

Policy grade slice. This slice bounds load balancer ingress to networking.load-balancer-ingress. It uses `load-balancer-ingress-slice-property-floor` and checks backend_health_path (nonempty): backend health path must name the concrete repository contract..

For load balancer ingress, choose a repository example that satisfies backend_health_path at the property-floor floor, plus a failure where backend health path must name the concrete repository contract. is false. For load balancer ingress, wire `property-floor` to `rig-services/infrastructure.networking.load-balancer-ingress.json` and keep its verdict on backend_health_path; missing evidence is a named gap, with ceiling load balancer ingress configuration validation only; declared policy does not prove running load balancer ingress behavior. Choose a repository-owned check that observes load balancer ingress from rig-services/infrastructure.networking.load-balancer-ingress.json..

Service-specific evidence cues:
Offer: Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.
minimal: backend health path — "/health".
mid: request timeout ms — 5000.
maximal: expose admin route — false.
