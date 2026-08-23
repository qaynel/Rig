# testing.mutation.ci-gate-policy - slice property-floor

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `property-floor` slice holds ownership at `mutation.ci-gate-policy` and prevents none from being silently absorbed. It activates `ci-gate-policy-source-code-boundary`, `ci-gate-policy-evidence-receipt` and reports a named coverage gap when its repository binding or required dependency is unavailable.
