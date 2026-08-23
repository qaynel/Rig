# infrastructure.cicd.release-gating - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming release gating result from a real policy violation. It activates `release-gating-source-code-boundary`, `release-gating-cicd-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
