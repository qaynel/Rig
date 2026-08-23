# product-security.secrets.encrypted-store - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

encrypted store is the sole catalogue owner of `secrets.encrypted-store`. It must not absorb other secrets concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `secrets.encrypted-store`, the result is a named nonzero coverage gap.

Acceptance target: fixture:product-security.secrets.encrypted-store:policy-boundary. Given source-code is present and secrets.encrypted-store is selected, pass only when the repository binding evaluates secrets.encrypted-store and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern.
