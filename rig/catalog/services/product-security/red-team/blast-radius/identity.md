# product-security.red-team.blast-radius - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

blast radius is the sole catalogue owner of `red-team.blast-radius`. It must not absorb other red team concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `red-team.blast-radius`, the result is a named nonzero coverage gap.

Acceptance target: fixture:product-security.red-team.blast-radius:policy-boundary. Given source-code is present and red-team.blast-radius is selected, pass only when the repository binding evaluates red-team.blast-radius and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern.
