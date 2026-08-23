# development.code-quality.correctness-static - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

correctness static is the sole catalogue owner of `correctness-static-analysis`, `complexity-static`. It must not absorb `security-sast`, `sast`. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `correctness-static-analysis`, `complexity-static`, the result is a named nonzero coverage gap.

Acceptance target: fixture:development.code-quality.correctness-static:policy-boundary. Given source-code is present and correctness-static-analysis is selected, pass only when the repository binding evaluates correctness-static-analysis and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims security-sast.
