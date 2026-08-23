# infrastructure.container.service-mesh - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

service mesh is the sole catalogue owner of `container.service-mesh`. It must not absorb other container concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `container.service-mesh`, the result is a named nonzero coverage gap.

Acceptance target: fixture:infrastructure.container.service-mesh:policy-boundary. Given source-code is present and container.service-mesh is selected, pass only when the repository binding evaluates container.service-mesh and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent container concern.
