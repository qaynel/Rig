# development.documentation.adrs - slice property-floor

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `property-floor` slice holds ownership at `documentation.adrs` and prevents none from being silently absorbed. It activates `adrs-source-code-boundary`, `adrs-evidence-receipt` and reports a named coverage gap when its repository binding or required dependency is unavailable.
