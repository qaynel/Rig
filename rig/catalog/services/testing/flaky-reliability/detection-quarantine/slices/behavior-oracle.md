# testing.flaky-reliability.detection-quarantine - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming detection quarantine result from a real policy violation. It activates `detection-quarantine-source-code-boundary`, `detection-quarantine-flaky-reliability-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
