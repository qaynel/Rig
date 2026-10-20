# product-security.license-compliance.sbom-inventory — maximal

Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.

Policy grade, maximal: Set omitting dependency versions to false. A component without an exact version cannot be matched to advisories, so record versions. Cumulative with minimal and mid. Binding checks: sbom-inventory-source-code-boundary, sbom-inventory-license-compliance-context, sbom-inventory-evidence-receipt.

Acceptance target: policy:product-security.license-compliance.sbom-inventory:maximal:sbom-inventory-source-code-boundary+sbom-inventory-license-compliance-context+sbom-inventory-evidence-receipt.
Declared predicates: sbom-inventory-source-code-boundary: `sbom_format` is nonempty (a string or array); sbom-inventory-license-compliance-context: `components` is nonempty (a string or array); sbom-inventory-evidence-receipt: `omit_dependency_versions` equals false.
