# infrastructure.cicd.release-gating - slice property-floor

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `property-floor` slice holds ownership at `cicd.release-gating` and prevents none from being silently absorbed. It activates `release-gating-source-code-boundary`, `release-gating-evidence-receipt` and reports a named coverage gap when its repository binding or required dependency is unavailable.
