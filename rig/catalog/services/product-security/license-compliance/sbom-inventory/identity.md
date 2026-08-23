# product-security.license-compliance.sbom-inventory - identity

Policy grade. This is generic baseline practice, not a claim of repository-tailored Context or Evidence coverage.

sbom inventory is the sole catalogue owner of `license-compliance.sbom-inventory`. It must not absorb other license compliance concerns. Profile evidence is `source-code`.

Disposition: convention. Dependencies: none. First wire reuses an existing repository command, then a native platform feature, then an installed dependency; if none observes `license-compliance.sbom-inventory`, the result is a named nonzero coverage gap.

Acceptance target: fixture:product-security.license-compliance.sbom-inventory:policy-boundary. Given source-code is present and license-compliance.sbom-inventory is selected, pass only when the repository binding evaluates license-compliance.sbom-inventory and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern.
