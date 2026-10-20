# infrastructure.networking.load-balancer-ingress — minimal

Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Policy grade remains the assurance level. `load-balancer-ingress-source-code-boundary` requires backend health path to be nonempty. The good fixture provides /health; the bad fixture uses an empty backend_health_path and should fail this predicate.

This is a JSON configuration check on `rig-services/infrastructure.networking.load-balancer-ingress.json`. A passing value does not prove a running load balancer ingress service is reachable or functioning. The checks validate the declared ingress configuration. They do not send requests, probe backend health, or prove that a deployed load balancer enforces the route and timeout settings.
