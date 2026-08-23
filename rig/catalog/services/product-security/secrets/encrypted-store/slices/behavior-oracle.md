# product-security.secrets.encrypted-store - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming encrypted store result from a real policy violation. It activates `encrypted-store-source-code-boundary`, `encrypted-store-secrets-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
