# product-security.license-compliance.sbom-inventory — behavior-oracle slice

Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.

Policy grade slice `sbom-inventory-slice-behavior-oracle`: Declare the SBOM format, such as CycloneDX or SPDX. A tool cannot read an unspecified format, so name it. Despite its name this slice is not a behavior oracle: it confirms an SBOM format, components and the omit-versions flag are declared; it does not generate or validate an SBOM.
