# infrastructure.networking.vpc-firewall - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

vpc firewall is the sole catalogue owner of `networking.vpc-firewall`. It must not absorb other networking concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `networking.vpc-firewall`, the result is a named nonzero coverage gap.

Acceptance target: fixture:infrastructure.networking.vpc-firewall:policy-boundary. Given source-code is present and networking.vpc-firewall is selected, pass only when the repository binding evaluates networking.vpc-firewall and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent networking concern.
