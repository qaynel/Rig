# product-security.license-compliance.sbom-inventory — identity

Policy grade: sbom inventory owns license-compliance.sbom-inventory. Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.

Keep neighboring license-compliance services outside the sbom inventory decision for license-compliance.sbom-inventory. Anchor the review on the configured input at `rig-services/product-security.license-compliance.sbom-inventory.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: sbom inventory configuration validation only; declared policy does not prove running sbom inventory behavior. Choose a repository-owned check that observes sbom inventory from rig-services/product-security.license-compliance.sbom-inventory.json.

Acceptance target: fixture:product-security.license-compliance.sbom-inventory:policy-boundary. Given source-code is present and license-compliance.sbom-inventory is selected, pass only when the repository binding evaluates license-compliance.sbom-inventory and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern.

Service-specific evidence cues:
Offer: Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.
minimal: sbom format — "cyclonedx".
mid: components — ["library@1.0.0"].
maximal: omit dependency versions — false.
