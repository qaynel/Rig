# product-security.secrets.precommit-leak-scanner - slice property-floor

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `property-floor` slice holds ownership at `secrets.precommit-leak-scanner` and prevents none from being silently absorbed. It activates `precommit-leak-scanner-source-code-boundary`, `precommit-leak-scanner-evidence-receipt` and reports a named coverage gap when its repository binding or required dependency is unavailable.
