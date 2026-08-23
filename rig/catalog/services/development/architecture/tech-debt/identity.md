# development.architecture.tech-debt - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

tech debt is the sole catalogue owner of `architecture.tech-debt`. It must not absorb other architecture concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `architecture.tech-debt`, the result is a named nonzero coverage gap.

Acceptance target: fixture:development.architecture.tech-debt:policy-boundary. Given source-code is present and architecture.tech-debt is selected, pass only when the repository binding evaluates architecture.tech-debt and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent architecture concern.
