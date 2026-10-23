# infrastructure.networking.load-balancer-ingress — floor and mutation-floor slice

Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Policy grade slice for load balancer ingress. `load-balancer-ingress-slice-floor` applies the same declared-field predicate as the minimal grade: backend health path must be nonempty. The floor requires a nonempty backend_health_path; the good fixture names /health and the bad fixture leaves the path empty.

The mutation-floor alias uses this same check ID and condition; it does not add a separate mutation test. The checks validate the declared ingress configuration. They do not send requests, probe backend health, or prove that a deployed load balancer enforces the route and timeout settings.
