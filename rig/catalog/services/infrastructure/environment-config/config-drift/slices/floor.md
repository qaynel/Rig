# infrastructure.environment-config.config-drift - slice floor + mutation-floor

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `floor` and `mutation-floor` slice establishes the lowest non-vacuous config drift verdict for `source-code`. It activates `config-drift-source-code-boundary` and reports a named coverage gap when its repository binding or required dependency is unavailable.
