# product-security.license-compliance.sbom-inventory — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for sbom inventory; it does not widen ownership beyond license-compliance.sbom-inventory. The context signals are components. Binding checks: sbom-inventory-license-compliance-context.

Read the existing repository's sbom inventory convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in license-compliance under their own verdicts.

Acceptance target: fixture:product-security.license-compliance.sbom-inventory:repository-context. Given license-compliance.sbom-inventory has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent license compliance concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.

Owned scope: `license-compliance.sbom-inventory`.

Offer: Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.

Input: `rig-services/product-security.license-compliance.sbom-inventory.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: sbom inventory configuration validation only; declared policy does not prove running sbom inventory behavior. Select an approved repository-owned command to verify that behavior.

minimal: sbom format — "cyclonedx".

mid: components — ["library@1.0.0"].

maximal: omit dependency versions — false.
