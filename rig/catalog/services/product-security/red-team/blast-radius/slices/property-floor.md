# product-security.red-team.blast-radius - slice property-floor

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `property-floor` slice holds ownership at `red-team.blast-radius` and prevents none from being silently absorbed. It activates `blast-radius-source-code-boundary`, `blast-radius-evidence-receipt` and reports a named coverage gap when its repository binding or required dependency is unavailable.
