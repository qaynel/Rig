# product-security.license-compliance.attribution — identity

Policy grade: attribution owns license-compliance.attribution. Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Keep neighboring license-compliance services outside the attribution decision for license-compliance.attribution. Anchor the review on the configured input at `rig-services/product-security.license-compliance.attribution.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: attribution configuration validation only; declared policy does not prove running attribution behavior. Choose a repository-owned check that observes attribution from rig-services/product-security.license-compliance.attribution.json.

Acceptance target: fixture:product-security.license-compliance.attribution:policy-boundary. Given source-code is present and license-compliance.attribution is selected, pass only when the repository binding evaluates license-compliance.attribution and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern.

Service-specific evidence cues:
Offer: Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.
minimal: notice paths — ["THIRD_PARTY_NOTICES"].
mid: attributed components — ["library@1.0.0"].
maximal: remove required notices — false.
