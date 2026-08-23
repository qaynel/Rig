# product-security.red-team.dast - slice property-floor

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `property-floor` slice holds ownership at `red-team.dast` and prevents none from being silently absorbed. It activates `dast-source-code-boundary`, `dast-evidence-receipt` and reports a named coverage gap when its repository binding or required dependency is unavailable.
