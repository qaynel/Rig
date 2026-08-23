# testing.integration.internal-contract - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

internal contract is the sole catalogue owner of `integration.internal-contract`. It must not absorb other integration concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `integration.internal-contract`, the result is a named nonzero coverage gap.

Acceptance target: fixture:testing.integration.internal-contract:policy-boundary. Given source-code is present and integration.internal-contract is selected, pass only when the repository binding evaluates integration.internal-contract and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern.
