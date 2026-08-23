# testing.mutation.language-adapter - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming language adapter result from a real policy violation. It activates `language-adapter-source-code-boundary`, `language-adapter-mutation-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
