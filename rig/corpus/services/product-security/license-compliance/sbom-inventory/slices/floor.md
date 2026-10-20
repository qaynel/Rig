# product-security.license-compliance.sbom-inventory — floor and mutation-floor slice

Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.

Policy grade slice. This slice bounds sbom inventory to license-compliance.sbom-inventory. It uses `sbom-inventory-slice-floor` and checks sbom_format (nonempty): sbom format must name the concrete repository contract.