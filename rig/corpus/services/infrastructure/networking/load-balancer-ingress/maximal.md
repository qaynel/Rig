# infrastructure.networking.load-balancer-ingress — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for load balancer ingress. The evidence must preserve the backend_health_path, request_timeout_ms, expose_admin_route inputs that determined the result. Binding checks: load-balancer-ingress-evidence-receipt.

Tie acceptance to a second run against unchanged load balancer ingress inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: load balancer ingress configuration validation only; declared policy does not prove running load balancer ingress behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.networking.load-balancer-ingress:evidence-replay. Given the networking.load-balancer-ingress binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Owned scope: `networking.load-balancer-ingress`.

Offer: Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Input: `rig-services/infrastructure.networking.load-balancer-ingress.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: load balancer ingress configuration validation only; declared policy does not prove running load balancer ingress behavior. Select an approved repository-owned command to verify that behavior.

minimal: backend health path — "/health".

mid: request timeout ms — 5000.

maximal: expose admin route — false.
