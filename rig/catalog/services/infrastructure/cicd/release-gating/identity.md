# infrastructure.cicd.release-gating - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

release gating is the sole catalogue owner of `cicd.release-gating`. It must not absorb other cicd concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `cicd.release-gating`, the result is a named nonzero coverage gap.

Acceptance target: fixture:infrastructure.cicd.release-gating:policy-boundary. Given source-code is present and cicd.release-gating is selected, pass only when the repository binding evaluates cicd.release-gating and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cicd concern.
