# testing.property-fuzz.shrinking - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming shrinking result from a real policy violation. It activates `shrinking-source-code-boundary`, `shrinking-property-fuzz-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
