# product-security.license-compliance.sbom-inventory — maximal

Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: sbom-inventory-source-code-boundary, sbom-inventory-license-compliance-context, sbom-inventory-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:product-security.license-compliance.sbom-inventory:maximal:sbom-inventory-source-code-boundary+sbom-inventory-license-compliance-context+sbom-inventory-evidence-receipt.

Declared predicates: sbom-inventory-source-code-boundary: `sbom_format` is nonempty (a string or array); sbom-inventory-license-compliance-context: `components` is nonempty (a string or array); sbom-inventory-evidence-receipt: `omit_dependency_versions` equals false.
