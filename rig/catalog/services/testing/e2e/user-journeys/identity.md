# testing.e2e.user-journeys - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

user journeys is the sole catalogue owner of `e2e.user-journeys`. It must not absorb other e2e concerns. Profile evidence is `source-code`; without `ui-surface` it remains selectable but is not recommended.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `e2e.user-journeys`, the result is a named nonzero coverage gap.

Acceptance target: fixture:testing.e2e.user-journeys:policy-boundary. Given source-code is present and e2e.user-journeys is selected, pass only when the repository binding evaluates e2e.user-journeys and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent e2e concern.
