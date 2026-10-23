# Load balancer ingress

Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Route requests only to healthy backends, bound their handling time, and keep administrative routes off public ingress.

Owned scope: `load-balancer-ingress`.

Read the declared input at `rig-services/infrastructure.networking.load-balancer-ingress.json`; retain its path in diagnostics when the file is malformed so the user can repair the right configuration.

Policy checks: backend health path is evaluated at minimal grade; `request_timeout_ms` is evaluated at mid; and `expose_admin_route` is evaluated at maximal.

Coverage ceiling: The checks validate the declared ingress configuration. They do not send requests, probe backend health, or prove that a deployed load balancer enforces the route and timeout settings.

Set backend_health_path to the health endpoint used by the service, request_timeout_ms to the allowed request budget, and expose_admin_route to false for public ingress. The validator inspects JSON values; live routing and backend health require a separately approved runtime check.
