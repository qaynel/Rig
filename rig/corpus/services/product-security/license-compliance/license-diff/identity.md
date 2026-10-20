# product-security.license-compliance.license-diff — identity

Policy grade: license diff owns license-compliance.license-diff. Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Keep neighboring license-compliance services outside the license diff decision for license-compliance.license-diff. Anchor the review on the configured input at `rig-services/product-security.license-compliance.license-diff.json`; malformed input is still attributed to that path.

Disposition: executable. Inspect the limit: license diff configuration validation only; declared policy does not prove running license diff behavior. Choose a repository-owned check that observes license diff from rig-services/product-security.license-compliance.license-diff.json.

Acceptance target: policy:product-security.license-compliance.license-diff:minimal:license-diff-source-code-boundary.

Declared predicates: license-diff-source-code-boundary: `previous_inventory` is nonempty (a string or array).
