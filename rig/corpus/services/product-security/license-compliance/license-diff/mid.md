# product-security.license-compliance.license-diff — mid

Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Policy grade, mid: Provide the current license inventory. A diff needs both sides, so reference the inventory for this release. Cumulative with minimal. Binding checks: license-diff-source-code-boundary, license-diff-license-compliance-context.

Acceptance target: policy:product-security.license-compliance.license-diff:mid:license-diff-source-code-boundary+license-diff-license-compliance-context.
Declared predicates: license-diff-source-code-boundary: `previous_inventory` is nonempty (a string or array); license-diff-license-compliance-context: `current_inventory` is nonempty (a string or array).
