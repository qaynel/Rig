# product-security.license-compliance.sbom-inventory - mid

Grade: mid (Context target). Until the named local evidence is wired, assurance remains Policy-grade generic baseline practice rather than repository-tailored coverage.

After the minimal boundary passes, `sbom-inventory-license-compliance-context` evaluates `license-compliance.sbom-inventory`. Given license-compliance.sbom-inventory has a repository-specific convention and evidence source, it passes only when the result names the consulted path or command and excludes an adjacent license compliance concern; it fails when the result infers local convention without an inspectable source. The target is `fixture:product-security.license-compliance.sbom-inventory:repository-context`, and adjacent license compliance ownership stays outside the verdict.
