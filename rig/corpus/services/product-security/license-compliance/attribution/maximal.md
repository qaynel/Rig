# product-security.license-compliance.attribution — maximal

Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: attribution-source-code-boundary, attribution-license-compliance-context, attribution-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:product-security.license-compliance.attribution:maximal:attribution-source-code-boundary+attribution-license-compliance-context+attribution-evidence-receipt.

Declared predicates: attribution-source-code-boundary: `notice_paths` is nonempty (a string or array); attribution-license-compliance-context: `attributed_components` is nonempty (a string or array); attribution-evidence-receipt: `remove_required_notices` equals false.
