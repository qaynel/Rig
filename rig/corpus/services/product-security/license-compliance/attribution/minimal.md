# product-security.license-compliance.attribution — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for attribution. The minimal boundary for attribution checks notice_paths (nonempty): notice paths must name the concrete repository contract.. Binding checks: attribution-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe license-compliance.attribution; bind it to the input named in `rig-services/product-security.license-compliance.attribution.json` and preserve the check's failure status. When adopting this in an existing repository, connect attribution to the command that inspects notice_paths and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside license-compliance.attribution as a failure.

Acceptance target: fixture:product-security.license-compliance.attribution:policy-boundary. Given source-code is present and license-compliance.attribution is selected, pass only when the repository binding evaluates license-compliance.attribution and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern. The ceiling is attribution configuration validation only; declared policy does not prove running attribution behavior. Choose a repository-owned check that observes attribution from rig-services/product-security.license-compliance.attribution.json..

Service-specific evidence cues:
Offer: Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.
minimal: notice paths — ["THIRD_PARTY_NOTICES"].
mid: attributed components — ["library@1.0.0"].
maximal: remove required notices — false.
