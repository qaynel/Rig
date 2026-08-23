# development.documentation.adrs - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

adrs is the sole catalogue owner of `documentation.adrs`. It must not absorb other documentation concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `documentation.adrs`, the result is a named nonzero coverage gap.

Acceptance target: fixture:development.documentation.adrs:policy-boundary. Given source-code is present and documentation.adrs is selected, pass only when the repository binding evaluates documentation.adrs and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent documentation concern.
