# testing.mutation.equivalent-mutant-detector - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming equivalent mutant detector result from a real policy violation. It activates `equivalent-mutant-detector-source-code-boundary`, `equivalent-mutant-detector-mutation-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
