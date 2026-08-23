# testing.flaky-reliability.intermittent-rca - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming intermittent rca result from a real policy violation. It activates `intermittent-rca-source-code-boundary`, `intermittent-rca-flaky-reliability-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
