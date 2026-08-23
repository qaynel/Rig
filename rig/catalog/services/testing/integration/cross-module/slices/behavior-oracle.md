# testing.integration.cross-module - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming cross module result from a real policy violation. It activates `cross-module-source-code-boundary`, `cross-module-integration-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
