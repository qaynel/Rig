# product-security.secrets.precommit-leak-scanner - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

precommit leak scanner is the sole catalogue owner of `secrets.precommit-leak-scanner`. It must not absorb other secrets concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `secrets.precommit-leak-scanner`, the result is a named nonzero coverage gap.

Acceptance target: fixture:product-security.secrets.precommit-leak-scanner:policy-boundary. Given source-code is present and secrets.precommit-leak-scanner is selected, pass only when the repository binding evaluates secrets.precommit-leak-scanner and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern.
