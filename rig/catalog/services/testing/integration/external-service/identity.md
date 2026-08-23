# testing.integration.external-service - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

external service is the sole catalogue owner of `integration.external-service`. It must not absorb other integration concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `integration.external-service`, the result is a named nonzero coverage gap.

Acceptance target: fixture:testing.integration.external-service:policy-boundary. Given source-code is present and integration.external-service is selected, pass only when the repository binding evaluates integration.external-service and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern.
