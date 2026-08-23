# testing.mutation.survivor-rca - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

survivor rca is the sole catalogue owner of `mutation.survivor-rca`. It must not absorb other mutation concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `mutation.survivor-rca`, the result is a named nonzero coverage gap.

Acceptance target: fixture:testing.mutation.survivor-rca:policy-boundary. Given source-code is present and mutation.survivor-rca is selected, pass only when the repository binding evaluates mutation.survivor-rca and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern.
