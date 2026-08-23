# testing.property-fuzz.shrinking - slice property-floor

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `property-floor` slice holds ownership at `property-fuzz.shrinking` and prevents none from being silently absorbed. It activates `shrinking-source-code-boundary`, `shrinking-evidence-receipt` and reports a named coverage gap when its repository binding or required dependency is unavailable.
