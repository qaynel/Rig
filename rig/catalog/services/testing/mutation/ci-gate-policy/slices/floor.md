# testing.mutation.ci-gate-policy - slice floor + mutation-floor

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `floor` and `mutation-floor` slice establishes the lowest non-vacuous ci gate policy verdict for `source-code`. It activates `ci-gate-policy-source-code-boundary` and reports a named coverage gap when its repository binding or required dependency is unavailable.
