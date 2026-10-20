# product-security.license-compliance.license-diff — maximal

Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: license-diff-source-code-boundary, license-diff-license-compliance-context, license-diff-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:product-security.license-compliance.license-diff:maximal:license-diff-source-code-boundary+license-diff-license-compliance-context+license-diff-evidence-receipt.

Declared predicates: license-diff-source-code-boundary: `previous_inventory` is nonempty (a string or array); license-diff-license-compliance-context: `current_inventory` is nonempty (a string or array); license-diff-evidence-receipt: `accept_new_licenses_automatically` equals false.
