# infrastructure.environment-config.mcp-compatibility - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

mcp compatibility is the sole catalogue owner of `environment-config.mcp-compatibility`. It must not absorb other environment config concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `environment-config.mcp-compatibility`, the result is a named nonzero coverage gap.

Acceptance target: fixture:infrastructure.environment-config.mcp-compatibility:policy-boundary. Given source-code is present and environment-config.mcp-compatibility is selected, pass only when the repository binding evaluates environment-config.mcp-compatibility and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern.
