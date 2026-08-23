# development.code-quality.typecheck - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

typecheck is the sole catalogue owner of `code-quality.typecheck`. It must not absorb other code quality concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `code-quality.typecheck`, the result is a named nonzero coverage gap.

Acceptance target: fixture:development.code-quality.typecheck:policy-boundary. Given source-code is present and code-quality.typecheck is selected, pass only when the repository binding evaluates code-quality.typecheck and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code quality concern.
