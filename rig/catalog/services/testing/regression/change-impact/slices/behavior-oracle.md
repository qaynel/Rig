# testing.regression.change-impact - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming change impact result from a real policy violation. It activates `change-impact-source-code-boundary`, `change-impact-regression-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
