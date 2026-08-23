# testing.flaky-reliability.intermittent-rca - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

intermittent rca is the sole catalogue owner of `flaky-reliability.intermittent-rca`. It must not absorb other flaky reliability concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `flaky-reliability.intermittent-rca`, the result is a named nonzero coverage gap.

Acceptance target: fixture:testing.flaky-reliability.intermittent-rca:policy-boundary. Given source-code is present and flaky-reliability.intermittent-rca is selected, pass only when the repository binding evaluates flaky-reliability.intermittent-rca and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent flaky reliability concern.
