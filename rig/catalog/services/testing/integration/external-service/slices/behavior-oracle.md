# testing.integration.external-service - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming external service result from a real policy violation. It activates `external-service-source-code-boundary`, `external-service-integration-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
