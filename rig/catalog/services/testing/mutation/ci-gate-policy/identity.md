# testing.mutation.ci-gate-policy - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

ci gate policy is the sole catalogue owner of `mutation.ci-gate-policy`. It must not absorb other mutation concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `mutation.ci-gate-policy`, the result is a named nonzero coverage gap.

Acceptance target: fixture:testing.mutation.ci-gate-policy:policy-boundary. Given source-code is present and mutation.ci-gate-policy is selected, pass only when the repository binding evaluates mutation.ci-gate-policy and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern.
