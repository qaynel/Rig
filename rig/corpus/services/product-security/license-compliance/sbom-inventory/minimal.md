# product-security.license-compliance.sbom-inventory — minimal

Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.

Policy grade, minimal: Declare the SBOM format, such as CycloneDX or SPDX. A tool cannot read an unspecified format, so name it. Binding checks: sbom-inventory-source-code-boundary.

Acceptance target: policy:product-security.license-compliance.sbom-inventory:minimal:sbom-inventory-source-code-boundary.
Declared predicates: sbom-inventory-source-code-boundary: `sbom_format` is nonempty (a string or array).
