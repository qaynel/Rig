# product-security.license-compliance.sbom-inventory — mid

Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: sbom-inventory-source-code-boundary, sbom-inventory-license-compliance-context.

Read the existing repository's sbom inventory convention, then name the source path or command that establishes it. For sbom inventory, inspect the repository's actual spec, source, test, or configuration for components; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring license-compliance services outside the sbom inventory decision for license-compliance.sbom-inventory.

Acceptance target: policy:product-security.license-compliance.sbom-inventory:mid:sbom-inventory-source-code-boundary+sbom-inventory-license-compliance-context.

Declared predicates: sbom-inventory-source-code-boundary: `sbom_format` is nonempty (a string or array); sbom-inventory-license-compliance-context: `components` is nonempty (a string or array).
