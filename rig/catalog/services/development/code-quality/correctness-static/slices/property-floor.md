# development.code-quality.correctness-static - slice property-floor

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `property-floor` slice holds ownership at `correctness-static-analysis`, `complexity-static` and prevents `security-sast`, `sast` from being silently absorbed. It activates `correctness-static-source-code-boundary`, `correctness-static-evidence-receipt` and reports a named coverage gap when its repository binding or required dependency is unavailable.
