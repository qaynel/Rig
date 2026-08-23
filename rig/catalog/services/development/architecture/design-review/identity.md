# development.architecture.design-review - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

design review is the sole catalogue owner of `architecture.design-review`. It must not absorb other architecture concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `architecture.design-review`, the result is a named nonzero coverage gap.

Acceptance target: fixture:development.architecture.design-review:policy-boundary. Given source-code is present and architecture.design-review is selected, pass only when the repository binding evaluates architecture.design-review and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent architecture concern.
