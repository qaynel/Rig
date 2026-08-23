# development.code-quality.correctness-static - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming correctness static result from a real policy violation. It activates `correctness-static-source-code-boundary`, `correctness-static-code-quality-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
