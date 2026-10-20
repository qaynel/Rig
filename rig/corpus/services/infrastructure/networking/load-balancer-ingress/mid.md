# infrastructure.networking.load-balancer-ingress — mid

Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Policy grade remains unchanged at mid. `load-balancer-ingress-networking-context` checks `request_timeout_ms` with the `minimum` predicate at 5000. A 5000 millisecond timeout meets the configured minimum; this check does not discover a repository-specific timeout convention.

The value comes from `rig-services/infrastructure.networking.load-balancer-ingress.json`; this is configuration validation, not a claim that the repository follows a discovered convention. The checks validate the declared ingress configuration. They do not send requests, probe backend health, or prove that a deployed load balancer enforces the route and timeout settings.
