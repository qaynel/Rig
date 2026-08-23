# testing.mutation.mutant-generator - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming mutant generator result from a real policy violation. It activates `mutant-generator-source-code-boundary`, `mutant-generator-mutation-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
