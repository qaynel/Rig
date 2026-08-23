# product-security.secrets.rotation-reminder - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

rotation reminder is the sole catalogue owner of `secrets.rotation-reminder`. It must not absorb other secrets concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `secrets.rotation-reminder`, the result is a named nonzero coverage gap.

Acceptance target: fixture:product-security.secrets.rotation-reminder:policy-boundary. Given source-code is present and secrets.rotation-reminder is selected, pass only when the repository binding evaluates secrets.rotation-reminder and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern.
