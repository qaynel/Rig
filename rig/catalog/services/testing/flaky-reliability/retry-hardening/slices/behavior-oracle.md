# testing.flaky-reliability.retry-hardening - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming retry hardening result from a real policy violation. It activates `retry-hardening-source-code-boundary`, `retry-hardening-flaky-reliability-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
