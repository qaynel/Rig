# product-security.license-compliance.sbom-inventory — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for sbom inventory; it does not widen ownership beyond license-compliance.sbom-inventory. For sbom inventory, inspect these context signals: components. Binding checks: sbom-inventory-license-compliance-context.

Read the existing repository's sbom inventory convention, then name the source path or command that establishes it. For sbom inventory, inspect the repository's actual spec, source, test, or configuration for components; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring license-compliance services outside the sbom inventory decision for license-compliance.sbom-inventory.

Acceptance target: fixture:product-security.license-compliance.sbom-inventory:repository-context. Given license-compliance.sbom-inventory has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent license compliance concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.
minimal: sbom format — "cyclonedx".
mid: components — ["library@1.0.0"].
maximal: omit dependency versions — false.
