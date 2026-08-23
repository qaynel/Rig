# testing.mutation.remediation-advisor - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming remediation advisor result from a real policy violation. It activates `remediation-advisor-source-code-boundary`, `remediation-advisor-mutation-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
