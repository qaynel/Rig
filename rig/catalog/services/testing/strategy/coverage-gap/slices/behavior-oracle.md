# testing.strategy.coverage-gap - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming coverage gap result from a real policy violation. It activates `coverage-gap-source-code-boundary`, `coverage-gap-strategy-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
