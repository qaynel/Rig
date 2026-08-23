# infrastructure.container.k8s-helm - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

k8s helm is the sole catalogue owner of `container.k8s-helm`. It must not absorb other container concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `container.k8s-helm`, the result is a named nonzero coverage gap.

Acceptance target: fixture:infrastructure.container.k8s-helm:policy-boundary. Given source-code is present and container.k8s-helm is selected, pass only when the repository binding evaluates container.k8s-helm and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent container concern.
