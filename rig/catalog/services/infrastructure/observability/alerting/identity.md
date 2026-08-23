# infrastructure.observability.alerting - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

alerting is the sole catalogue owner of `observability.alerting`. It must not absorb other observability concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `observability.alerting`, the result is a named nonzero coverage gap.

Acceptance target: fixture:infrastructure.observability.alerting:policy-boundary. Given source-code is present and observability.alerting is selected, pass only when the repository binding evaluates observability.alerting and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent observability concern.
