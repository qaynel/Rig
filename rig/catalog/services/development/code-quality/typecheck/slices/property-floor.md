# development.code-quality.typecheck - slice property-floor

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `property-floor` slice holds ownership at `code-quality.typecheck` and prevents none from being silently absorbed. It activates `typecheck-source-code-boundary`, `typecheck-evidence-receipt` and reports a named coverage gap when its repository binding or required dependency is unavailable.
