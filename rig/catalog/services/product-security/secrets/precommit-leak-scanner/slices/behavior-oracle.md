# product-security.secrets.precommit-leak-scanner - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming precommit leak scanner result from a real policy violation. It activates `precommit-leak-scanner-source-code-boundary`, `precommit-leak-scanner-secrets-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
