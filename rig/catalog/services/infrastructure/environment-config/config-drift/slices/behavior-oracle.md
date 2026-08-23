# infrastructure.environment-config.config-drift - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming config drift result from a real policy violation. It activates `config-drift-source-code-boundary`, `config-drift-environment-config-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
