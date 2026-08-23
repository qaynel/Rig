# product-security.red-team.blast-radius - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming blast radius result from a real policy violation. It activates `blast-radius-source-code-boundary`, `blast-radius-red-team-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
