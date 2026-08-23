# product-security.license-compliance.sbom-inventory - minimal

Grade: minimal. Assurance is Policy grade generic baseline practice and is not tailored to the installing repository.

`sbom-inventory-source-code-boundary` owns `license-compliance.sbom-inventory`. Given source-code is present and license-compliance.sbom-inventory is selected, it passes only when the repository binding evaluates license-compliance.sbom-inventory and returns zero. It fails when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern. Evidence is recorded against `fixture:product-security.license-compliance.sbom-inventory:policy-boundary`; absence never becomes a pass.
