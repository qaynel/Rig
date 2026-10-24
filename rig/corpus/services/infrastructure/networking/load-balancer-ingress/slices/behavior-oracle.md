# infrastructure.networking.load-balancer-ingress — behavior-oracle slice

Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Policy grade slice for load balancer ingress. `load-balancer-ingress-slice-behavior-oracle` applies the nonempty backend_health_path predicate to the declared JSON input. Despite the slice name, this check does not issue a health request or observe traffic. It only checks that backend_health_path is nonempty.

This slice does not observe runtime behavior; its result is limited to the configuration field at `rig-services/infrastructure.networking.load-balancer-ingress.json`. The checks validate the declared ingress configuration. They do not send requests, probe backend health, or prove that a deployed load balancer enforces the route and timeout settings.
