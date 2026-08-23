# infrastructure.cicd.deployment-strategy - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

deployment strategy is the sole catalogue owner of `cicd.deployment-strategy`. It must not absorb other cicd concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `cicd.deployment-strategy`, the result is a named nonzero coverage gap.

Acceptance target: fixture:infrastructure.cicd.deployment-strategy:policy-boundary. Given source-code is present and cicd.deployment-strategy is selected, pass only when the repository binding evaluates cicd.deployment-strategy and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent cicd concern.
