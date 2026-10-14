# product-security.license-compliance.attribution — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for attribution. It checks notice_paths (nonempty): notice paths must name the concrete repository contract.. Binding checks: attribution-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe license-compliance.attribution; bind it to the input named in `rig-services/product-security.license-compliance.attribution.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside license-compliance.attribution is a failure.

Acceptance target: fixture:product-security.license-compliance.attribution:policy-boundary. Given source-code is present and license-compliance.attribution is selected, pass only when the repository binding evaluates license-compliance.attribution and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Owned scope: `license-compliance.attribution`.

Offer: Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Input: `rig-services/product-security.license-compliance.attribution.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: attribution configuration validation only; declared policy does not prove running attribution behavior. Select an approved repository-owned command to verify that behavior.

minimal: notice paths — ["THIRD_PARTY_NOTICES"].

mid: attributed components — ["library@1.0.0"].

maximal: remove required notices — false.
