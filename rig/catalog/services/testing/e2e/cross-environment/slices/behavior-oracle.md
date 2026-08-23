# testing.e2e.cross-environment - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming cross environment result from a real policy violation. It activates `cross-environment-source-code-boundary`, `cross-environment-e2e-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
