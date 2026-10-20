# product-security.license-compliance.sbom-inventory — identity

Policy grade: sbom inventory owns license-compliance.sbom-inventory. Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.

Keep neighboring license-compliance services outside the sbom inventory decision for license-compliance.sbom-inventory. Anchor the review on the configured input at `rig-services/product-security.license-compliance.sbom-inventory.json`; malformed input is still attributed to that path.

Disposition: executable. Inspect the limit: sbom inventory configuration validation only; declared policy does not prove running sbom inventory behavior. Choose a repository-owned check that observes sbom inventory from rig-services/product-security.license-compliance.sbom-inventory.json.

Acceptance target: policy:product-security.license-compliance.sbom-inventory:minimal:sbom-inventory-source-code-boundary.

Declared predicates: sbom-inventory-source-code-boundary: `sbom_format` is nonempty (a string or array).
