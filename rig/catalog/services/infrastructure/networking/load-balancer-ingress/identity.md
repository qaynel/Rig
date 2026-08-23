# infrastructure.networking.load-balancer-ingress - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

load balancer ingress is the sole catalogue owner of `networking.load-balancer-ingress`. It must not absorb other networking concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `networking.load-balancer-ingress`, the result is a named nonzero coverage gap.

Acceptance target: fixture:infrastructure.networking.load-balancer-ingress:policy-boundary. Given source-code is present and networking.load-balancer-ingress is selected, pass only when the repository binding evaluates networking.load-balancer-ingress and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern.
