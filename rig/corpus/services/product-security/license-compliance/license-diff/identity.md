# product-security.license-compliance.license-diff — identity

license diff owns license-compliance.license-diff. Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Keep sibling services in license-compliance under their own verdicts. Anchor the review on the configured input at `rig-services/product-security.license-compliance.license-diff.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: license diff configuration validation only; declared policy does not prove running license diff behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.license-compliance.license-diff:policy-boundary. Given source-code is present and license-compliance.license-diff is selected, pass only when the repository binding evaluates license-compliance.license-diff and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern.
