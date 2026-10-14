# product-security.license-compliance.sbom-inventory — minimal

Minimal establishes a non-vacuous policy boundary for sbom inventory. It checks sbom_format (nonempty): sbom format must name the concrete repository contract..

Tie acceptance to a repository-owned command or existing native check that can observe license-compliance.sbom-inventory; bind it to the input named in `rig-services/product-security.license-compliance.sbom-inventory.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside license-compliance.sbom-inventory is a failure.

Acceptance target: fixture:product-security.license-compliance.sbom-inventory:policy-boundary. Given source-code is present and license-compliance.sbom-inventory is selected, pass only when the repository binding evaluates license-compliance.sbom-inventory and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern. A passing policy check does not establish runtime behavior.
