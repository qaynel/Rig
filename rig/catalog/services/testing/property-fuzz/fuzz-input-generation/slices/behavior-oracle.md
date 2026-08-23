# testing.property-fuzz.fuzz-input-generation - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming fuzz input generation result from a real policy violation. It activates `fuzz-input-generation-source-code-boundary`, `fuzz-input-generation-property-fuzz-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
