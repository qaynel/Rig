# product-security.license-compliance.sbom-inventory — mid

Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.

Policy grade, mid: List the components in the inventory. An empty SBOM describes nothing shipped, so include every component. Cumulative with minimal. Binding checks: sbom-inventory-source-code-boundary, sbom-inventory-license-compliance-context.

Acceptance target: policy:product-security.license-compliance.sbom-inventory:mid:sbom-inventory-source-code-boundary+sbom-inventory-license-compliance-context.
Declared predicates: sbom-inventory-source-code-boundary: `sbom_format` is nonempty (a string or array); sbom-inventory-license-compliance-context: `components` is nonempty (a string or array).
