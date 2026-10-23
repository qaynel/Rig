# product-security.license-compliance.attribution — maximal

Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Policy grade, maximal: Set removing required notices to false. A license label cannot replace a required copyright notice, so keep them in the distributed output. Cumulative with minimal and mid. Binding checks: attribution-source-code-boundary, attribution-license-compliance-context, attribution-evidence-receipt.

Acceptance target: policy:product-security.license-compliance.attribution:maximal:attribution-source-code-boundary+attribution-license-compliance-context+attribution-evidence-receipt.
Declared predicates: attribution-source-code-boundary: `notice_paths` is nonempty (a string or array); attribution-license-compliance-context: `attributed_components` is nonempty (a string or array); attribution-evidence-receipt: `remove_required_notices` equals false.
