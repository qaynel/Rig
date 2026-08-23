# infrastructure.scaling-reliability.autoscaling - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

autoscaling is the sole catalogue owner of `scaling-reliability.autoscaling`. It must not absorb other scaling reliability concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `scaling-reliability.autoscaling`, the result is a named nonzero coverage gap.

Acceptance target: fixture:infrastructure.scaling-reliability.autoscaling:policy-boundary. Given source-code is present and scaling-reliability.autoscaling is selected, pass only when the repository binding evaluates scaling-reliability.autoscaling and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent scaling reliability concern.
