# development.code-quality.code-review - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming code review result from a real policy violation. It activates `code-review-source-code-boundary`, `code-review-code-quality-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
