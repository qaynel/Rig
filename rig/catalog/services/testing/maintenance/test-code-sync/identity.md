# testing.maintenance.test-code-sync - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

test code sync is the sole catalogue owner of `maintenance.test-code-sync`. It must not absorb other maintenance concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `maintenance.test-code-sync`, the result is a named nonzero coverage gap.

Acceptance target: fixture:testing.maintenance.test-code-sync:policy-boundary. Given source-code is present and maintenance.test-code-sync is selected, pass only when the repository binding evaluates maintenance.test-code-sync and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent maintenance concern.
