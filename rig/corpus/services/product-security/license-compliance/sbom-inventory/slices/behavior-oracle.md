# product-security.license-compliance.sbom-inventory — behavior-oracle slice

This slice bounds sbom inventory to license-compliance.sbom-inventory. It uses `sbom-inventory-slice-behavior-oracle` and checks sbom_format (nonempty): sbom format must name the concrete repository contract..

Start from a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.license-compliance.sbom-inventory.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than sbom inventory configuration validation only; declared policy does not prove running sbom inventory behavior. Select an approved repository-owned command to verify that behavior.
