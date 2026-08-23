# development.architecture.system-design - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

system design is the sole catalogue owner of `architecture.system-design`. It must not absorb other architecture concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `architecture.system-design`, the result is a named nonzero coverage gap.

Acceptance target: fixture:development.architecture.system-design:policy-boundary. Given source-code is present and architecture.system-design is selected, pass only when the repository binding evaluates architecture.system-design and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent architecture concern.
