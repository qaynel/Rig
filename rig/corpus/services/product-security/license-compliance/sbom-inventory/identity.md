# product-security.license-compliance.sbom-inventory — identity

sbom inventory owns license-compliance.sbom-inventory. Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.

Keep sibling services in license-compliance under their own verdicts. Anchor the review on the configured input at `rig-services/product-security.license-compliance.sbom-inventory.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: sbom inventory configuration validation only; declared policy does not prove running sbom inventory behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.license-compliance.sbom-inventory:policy-boundary. Given source-code is present and license-compliance.sbom-inventory is selected, pass only when the repository binding evaluates license-compliance.sbom-inventory and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern.
