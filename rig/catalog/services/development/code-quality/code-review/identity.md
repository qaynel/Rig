# development.code-quality.code-review - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

code review is the sole catalogue owner of `code-quality.code-review`. It must not absorb other code quality concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `code-quality.code-review`, the result is a named nonzero coverage gap.

Acceptance target: fixture:development.code-quality.code-review:policy-boundary. Given source-code is present and code-quality.code-review is selected, pass only when the repository binding evaluates code-quality.code-review and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code quality concern.
