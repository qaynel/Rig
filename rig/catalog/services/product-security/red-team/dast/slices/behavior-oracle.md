# product-security.red-team.dast - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming dast result from a real policy violation. It activates `dast-source-code-boundary`, `dast-red-team-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
