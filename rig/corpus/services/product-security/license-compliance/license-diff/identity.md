# product-security.license-compliance.license-diff — identity

Policy grade: license diff owns license-compliance.license-diff. Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Keep neighboring license-compliance services outside the license diff decision for license-compliance.license-diff. Anchor the review on the configured input at `rig-services/product-security.license-compliance.license-diff.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: license diff configuration validation only; declared policy does not prove running license diff behavior. Choose a repository-owned check that observes license diff from rig-services/product-security.license-compliance.license-diff.json.

Acceptance target: fixture:product-security.license-compliance.license-diff:policy-boundary. Given source-code is present and license-compliance.license-diff is selected, pass only when the repository binding evaluates license-compliance.license-diff and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern.

Service-specific evidence cues:
Offer: Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.
minimal: previous inventory — "licenses.previous.json".
mid: current inventory — "licenses.current.json".
maximal: accept new licenses automatically — false.
