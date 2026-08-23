# product-security.red-team.abuse-resistance - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming abuse resistance result from a real policy violation. It activates `abuse-resistance-source-code-boundary`, `abuse-resistance-red-team-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
