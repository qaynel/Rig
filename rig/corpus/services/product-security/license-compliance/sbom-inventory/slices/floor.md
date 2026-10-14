# product-security.license-compliance.sbom-inventory — floor and mutation-floor slice

Policy grade slice. This slice bounds sbom inventory to license-compliance.sbom-inventory. It uses `sbom-inventory-slice-floor` and checks sbom_format (nonempty): sbom format must name the concrete repository contract..

For sbom inventory, choose a repository example that satisfies sbom_format at the floor and mutation-floor floor, plus a failure where sbom format must name the concrete repository contract. is false. For sbom inventory, wire `floor and mutation-floor` to `rig-services/product-security.license-compliance.sbom-inventory.json` and keep its verdict on sbom_format; missing evidence is a named gap, with ceiling sbom inventory configuration validation only; declared policy does not prove running sbom inventory behavior. Choose a repository-owned check that observes sbom inventory from rig-services/product-security.license-compliance.sbom-inventory.json..

Service-specific evidence cues:
Offer: Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.
minimal: sbom format — "cyclonedx".
mid: components — ["library@1.0.0"].
maximal: omit dependency versions — false.
