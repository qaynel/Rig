# product-security.red-team.auth-session-probe - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

auth session probe is the sole catalogue owner of `red-team.auth-session-probe`. It must not absorb other red team concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `red-team.auth-session-probe`, the result is a named nonzero coverage gap.

Acceptance target: fixture:product-security.red-team.auth-session-probe:policy-boundary. Given source-code is present and red-team.auth-session-probe is selected, pass only when the repository binding evaluates red-team.auth-session-probe and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern.
