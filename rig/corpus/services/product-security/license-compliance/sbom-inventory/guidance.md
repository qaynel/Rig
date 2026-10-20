# sbom-inventory

Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.

Owned scope: `license-compliance.sbom-inventory`. Input: `rig-services/product-security.license-compliance.sbom-inventory.json`.

Coverage ceiling: Configuration validation only, so it confirms an SBOM format, components and the omit-versions flag are declared; it does not generate or validate an SBOM.

minimal: sbom format — "cyclonedx". Declare the SBOM format, such as CycloneDX or SPDX. A tool cannot read an unspecified format, so name it.

mid: components — ["library@1.0.0"]. List the components in the inventory. An empty SBOM describes nothing shipped, so include every component.

maximal: omit dependency versions — false. Set omitting dependency versions to false. A component without an exact version cannot be matched to advisories, so record versions.
