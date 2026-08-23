# testing.regression.change-impact - slice property-floor

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `property-floor` slice holds ownership at `regression.change-impact` and prevents none from being silently absorbed. It activates `change-impact-source-code-boundary`, `change-impact-evidence-receipt` and reports a named coverage gap when its repository binding or required dependency is unavailable.
