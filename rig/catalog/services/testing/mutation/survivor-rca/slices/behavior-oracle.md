# testing.mutation.survivor-rca - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming survivor rca result from a real policy violation. It activates `survivor-rca-source-code-boundary`, `survivor-rca-mutation-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
