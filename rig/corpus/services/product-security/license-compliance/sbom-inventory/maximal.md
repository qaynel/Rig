# product-security.license-compliance.sbom-inventory — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for sbom inventory. The evidence must preserve the sbom_format, components, omit_dependency_versions inputs that determined the result. Binding checks: sbom-inventory-evidence-receipt.

Ground the decision in a second run against unchanged sbom inventory inputs. Record the sbom_format, components, omit_dependency_versions inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this sbom inventory result is stale. The ceiling remains: sbom inventory configuration validation only; declared policy does not prove running sbom inventory behavior. Choose a repository-owned check that observes sbom inventory from rig-services/product-security.license-compliance.sbom-inventory.json.

Acceptance target: fixture:product-security.license-compliance.sbom-inventory:evidence-replay. Given the license-compliance.sbom-inventory binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.
minimal: sbom format — "cyclonedx".
mid: components — ["library@1.0.0"].
maximal: omit dependency versions — false.
