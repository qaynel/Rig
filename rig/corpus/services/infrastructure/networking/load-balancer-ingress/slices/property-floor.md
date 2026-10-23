# infrastructure.networking.load-balancer-ingress — property-floor slice

Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Policy grade slice for load balancer ingress. `load-balancer-ingress-slice-property-floor` requires backend health path to be nonempty. The property floor verifies a configured health-path string only; it does not establish that the endpoint exists or returns healthy status.

No runtime property is measured by this predicate. The checks validate the declared ingress configuration. They do not send requests, probe backend health, or prove that a deployed load balancer enforces the route and timeout settings.
