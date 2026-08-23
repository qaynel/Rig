# product-security.red-team.adversarial-simulation - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

adversarial simulation is the sole catalogue owner of `red-team.adversarial-simulation`. It must not absorb other red team concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `red-team.adversarial-simulation`, the result is a named nonzero coverage gap.

Acceptance target: fixture:product-security.red-team.adversarial-simulation:policy-boundary. Given source-code is present and red-team.adversarial-simulation is selected, pass only when the repository binding evaluates red-team.adversarial-simulation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern.
