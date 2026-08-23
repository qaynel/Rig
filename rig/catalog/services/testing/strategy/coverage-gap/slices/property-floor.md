# testing.strategy.coverage-gap - slice property-floor

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `property-floor` slice holds ownership at `strategy.coverage-gap` and prevents none from being silently absorbed. It activates `coverage-gap-source-code-boundary`, `coverage-gap-evidence-receipt` and reports a named coverage gap when its repository binding or required dependency is unavailable.
