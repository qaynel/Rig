# development.code-quality.typecheck - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming typecheck result from a real policy violation. It activates `typecheck-source-code-boundary`, `typecheck-code-quality-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
