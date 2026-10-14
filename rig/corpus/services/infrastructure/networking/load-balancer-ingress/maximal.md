# infrastructure.networking.load-balancer-ingress — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for load balancer ingress. The evidence must preserve the backend_health_path, request_timeout_ms, expose_admin_route inputs that determined the result. Binding checks: load-balancer-ingress-evidence-receipt.

Tie acceptance to a second run against unchanged load balancer ingress inputs. Record the backend_health_path, request_timeout_ms, expose_admin_route inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this load balancer ingress result is stale. The ceiling remains: load balancer ingress configuration validation only; declared policy does not prove running load balancer ingress behavior. Choose a repository-owned check that observes load balancer ingress from rig-services/infrastructure.networking.load-balancer-ingress.json.

Acceptance target: fixture:infrastructure.networking.load-balancer-ingress:evidence-replay. Given the networking.load-balancer-ingress binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.
minimal: backend health path — "/health".
mid: request timeout ms — 5000.
maximal: expose admin route — false.
