# infrastructure.environment-config.secret-injection - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

secret injection is the sole catalogue owner of `runtime-secret-injection`, `secret-injection-wiring`. It must not absorb other environment config concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `runtime-secret-injection`, `secret-injection-wiring`, the result is a named nonzero coverage gap.

Acceptance target: fixture:infrastructure.environment-config.secret-injection:policy-boundary. Given source-code is present and runtime-secret-injection is selected, pass only when the repository binding evaluates runtime-secret-injection and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern.
