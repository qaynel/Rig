# infrastructure.networking.load-balancer-ingress — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for load balancer ingress; it does not widen ownership beyond networking.load-balancer-ingress. For load balancer ingress, inspect these context signals: request_timeout_ms. Binding checks: load-balancer-ingress-networking-context.

Inspect the existing repository's load balancer ingress convention, then name the source path or command that establishes it. For load balancer ingress, inspect the repository's actual spec, source, test, or configuration for request_timeout_ms; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring networking services outside the load balancer ingress decision for networking.load-balancer-ingress.

Acceptance target: fixture:infrastructure.networking.load-balancer-ingress:repository-context. Given networking.load-balancer-ingress has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent networking concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.
minimal: backend health path — "/health".
mid: request timeout ms — 5000.
maximal: expose admin route — false.
