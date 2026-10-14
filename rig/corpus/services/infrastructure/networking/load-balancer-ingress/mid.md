# infrastructure.networking.load-balancer-ingress — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for load balancer ingress; it does not widen ownership beyond networking.load-balancer-ingress. The context signals are request_timeout_ms. Binding checks: load-balancer-ingress-networking-context.

Inspect the existing repository's load balancer ingress convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in networking under their own verdicts.

Acceptance target: fixture:infrastructure.networking.load-balancer-ingress:repository-context. Given networking.load-balancer-ingress has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent networking concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Owned scope: `networking.load-balancer-ingress`.

Offer: Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Input: `rig-services/infrastructure.networking.load-balancer-ingress.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: load balancer ingress configuration validation only; declared policy does not prove running load balancer ingress behavior. Select an approved repository-owned command to verify that behavior.

minimal: backend health path — "/health".

mid: request timeout ms — 5000.

maximal: expose admin route — false.
