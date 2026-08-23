# product-security.license-compliance.sbom-inventory - slice behavior-oracle

Policy-grade generic baseline practice, not repository-tailored Context or Evidence coverage.

The `behavior-oracle` slice requires an example that distinguishes a conforming sbom inventory result from a real policy violation. It activates `sbom-inventory-source-code-boundary`, `sbom-inventory-license-compliance-context` and reports a named coverage gap when its repository binding or required dependency is unavailable.
