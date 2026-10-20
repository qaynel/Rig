# product-security.license-compliance.license-diff — minimal

Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Policy grade, minimal: Provide the previous license inventory for the release. Without a baseline changes cannot be seen, so reference the earlier inventory. Binding checks: license-diff-source-code-boundary.

Acceptance target: policy:product-security.license-compliance.license-diff:minimal:license-diff-source-code-boundary.
Declared predicates: license-diff-source-code-boundary: `previous_inventory` is nonempty (a string or array).
