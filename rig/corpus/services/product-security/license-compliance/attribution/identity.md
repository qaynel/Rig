# product-security.license-compliance.attribution — identity

attribution owns license-compliance.attribution. Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Keep sibling services in license-compliance under their own verdicts. Anchor the review on the configured input at `rig-services/product-security.license-compliance.attribution.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: attribution configuration validation only; declared policy does not prove running attribution behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.license-compliance.attribution:policy-boundary. Given source-code is present and license-compliance.attribution is selected, pass only when the repository binding evaluates license-compliance.attribution and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern.
