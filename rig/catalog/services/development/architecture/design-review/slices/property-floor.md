# development.architecture.design-review - slice property-floor

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `property-floor` slice holds ownership at `architecture.design-review` and prevents none from being silently absorbed. It activates `design-review-source-code-boundary`, `design-review-evidence-receipt` and reports a named coverage gap when its repository binding or required dependency is unavailable.
