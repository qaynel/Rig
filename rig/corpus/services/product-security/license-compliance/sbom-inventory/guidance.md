# sbom inventory

Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.

Owned scope: `license-compliance.sbom-inventory`.

Offer: Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.

Input: `rig-services/product-security.license-compliance.sbom-inventory.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: sbom inventory configuration validation only; declared policy does not prove running sbom inventory behavior. Select an approved repository-owned command to verify that behavior.

minimal: sbom format — "cyclonedx".

mid: components — ["library@1.0.0"].

maximal: omit dependency versions — false.

