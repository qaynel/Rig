# product-security.license-compliance.sbom-inventory — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for sbom inventory. The minimal boundary for sbom inventory checks sbom_format (nonempty): sbom format must name the concrete repository contract.. Binding checks: sbom-inventory-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe license-compliance.sbom-inventory; bind it to the input named in `rig-services/product-security.license-compliance.sbom-inventory.json` and preserve the check's failure status. When adopting this in an existing repository, connect sbom inventory to the command that inspects sbom_format and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside license-compliance.sbom-inventory as a failure.

Acceptance target: fixture:product-security.license-compliance.sbom-inventory:policy-boundary. Given source-code is present and license-compliance.sbom-inventory is selected, pass only when the repository binding evaluates license-compliance.sbom-inventory and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern. The ceiling is sbom inventory configuration validation only; declared policy does not prove running sbom inventory behavior. Choose a repository-owned check that observes sbom inventory from rig-services/product-security.license-compliance.sbom-inventory.json..

Service-specific evidence cues:
Offer: Record a machine-readable software inventory with exact component versions. An SBOM describes shipped components; it does not by itself establish license or vulnerability compliance.
minimal: sbom format — "cyclonedx".
mid: components — ["library@1.0.0"].
maximal: omit dependency versions — false.
