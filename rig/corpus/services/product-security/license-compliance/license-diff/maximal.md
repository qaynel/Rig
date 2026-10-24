# product-security.license-compliance.license-diff — maximal

Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Policy grade, maximal: Set accepting new licenses automatically to false. New or changed obligations need a deliberate disposition, so review each one. Cumulative with minimal and mid. Binding checks: license-diff-source-code-boundary, license-diff-license-compliance-context, license-diff-evidence-receipt.

Acceptance target: policy:product-security.license-compliance.license-diff:maximal:license-diff-source-code-boundary+license-diff-license-compliance-context+license-diff-evidence-receipt.
Declared predicates: license-diff-source-code-boundary: `previous_inventory` is nonempty (a string or array); license-diff-license-compliance-context: `current_inventory` is nonempty (a string or array); license-diff-evidence-receipt: `accept_new_licenses_automatically` equals false.
