# infrastructure.networking.load-balancer-ingress — identity

load balancer ingress owns networking.load-balancer-ingress. Route only healthy backends with bounded request handling. Administrative routes remain outside the public ingress surface.

Keep sibling services in networking under their own verdicts. Start from the configured input at `rig-services/infrastructure.networking.load-balancer-ingress.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: load balancer ingress configuration validation only; declared policy does not prove running load balancer ingress behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.networking.load-balancer-ingress:policy-boundary. Given source-code is present and networking.load-balancer-ingress is selected, pass only when the repository binding evaluates networking.load-balancer-ingress and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern.
