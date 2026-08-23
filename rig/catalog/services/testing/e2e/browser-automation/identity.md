# testing.e2e.browser-automation - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

browser automation is the sole catalogue owner of `e2e.browser-automation`. It must not absorb other e2e concerns. Profile evidence is `source-code`; without `ui-surface` it remains selectable but is not recommended.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `e2e.browser-automation`, the result is a named nonzero coverage gap.

Acceptance target: fixture:testing.e2e.browser-automation:policy-boundary. Given source-code is present and e2e.browser-automation is selected, pass only when the repository binding evaluates e2e.browser-automation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent e2e concern.
