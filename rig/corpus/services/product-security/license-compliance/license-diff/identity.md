# product-security.license-compliance.license-diff — identity

Policy grade: license-diff owns license-compliance.license-diff. Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Input: `rig-services/product-security.license-compliance.license-diff.json`. Configuration validation only, so it confirms previous and current inventories and the auto-accept flag are declared; it does not compute a diff.

Disposition: executable.
Acceptance target: policy:product-security.license-compliance.license-diff:minimal:license-diff-source-code-boundary.
Declared predicates: license-diff-source-code-boundary: `previous_inventory` is nonempty (a string or array).
