# product-security.red-team.auth-session-probe - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming auth session probe result from a real policy violation. It activates `auth-session-probe-source-code-boundary`, `auth-session-probe-red-team-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
