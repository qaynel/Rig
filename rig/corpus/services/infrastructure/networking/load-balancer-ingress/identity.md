# infrastructure.networking.load-balancer-ingress — identity

Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Policy grade: Load balancer ingress owns only `load-balancer-ingress`. Route requests only to healthy backends, bound their handling time, and keep administrative routes off public ingress.

The applicable surface is source-code with its declared input at `rig-services/infrastructure.networking.load-balancer-ingress.json`; discovery preserves that path even when the JSON is malformed. The installed check evaluates the fields below, not live load balancer ingress behavior.

Disposition: executable configuration validation. Coverage ceiling: load balancer ingress configuration validation only. The checks do not send requests, probe backend health, or prove that a deployed load balancer enforces the route and timeout settings.

The good fixture at `tests/fixtures/services/infrastructure.networking.load-balancer-ingress/good/rig-services/infrastructure.networking.load-balancer-ingress.json` passes the declared predicates. The bad fixture at `tests/fixtures/services/infrastructure.networking.load-balancer-ingress/bad/rig-services/infrastructure.networking.load-balancer-ingress.json` demonstrates the backend health path boundary. No adjacent networking service is part of this decision.
