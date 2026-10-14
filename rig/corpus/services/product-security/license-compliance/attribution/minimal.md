# product-security.license-compliance.attribution — minimal

Minimal establishes a non-vacuous policy boundary for attribution. It checks notice_paths (nonempty): notice paths must name the concrete repository contract..

Tie acceptance to a repository-owned command or existing native check that can observe license-compliance.attribution; bind it to the input named in `rig-services/product-security.license-compliance.attribution.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside license-compliance.attribution is a failure.

Acceptance target: fixture:product-security.license-compliance.attribution:policy-boundary. Given source-code is present and license-compliance.attribution is selected, pass only when the repository binding evaluates license-compliance.attribution and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern. A passing policy check does not establish runtime behavior.
