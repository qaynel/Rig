# testing.mutation.ci-gate-policy - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming ci gate policy result from a real policy violation. It activates `ci-gate-policy-source-code-boundary`, `ci-gate-policy-mutation-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
