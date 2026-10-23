# product-security.license-compliance.sbom-inventory — identity

Policy grade: sbom-inventory owns license-compliance.sbom-inventory. Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.

Input: `rig-services/product-security.license-compliance.sbom-inventory.json`. Configuration validation only, so it confirms an SBOM format, components and the omit-versions flag are declared; it does not generate or validate an SBOM.

Disposition: executable.
Acceptance target: policy:product-security.license-compliance.sbom-inventory:minimal:sbom-inventory-source-code-boundary.
Declared predicates: sbom-inventory-source-code-boundary: `sbom_format` is nonempty (a string or array).
