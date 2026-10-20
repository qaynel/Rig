# product-security.license-compliance.policy-conflict — maximal

Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: policy-conflict-source-code-boundary, policy-conflict-license-compliance-context, policy-conflict-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:product-security.license-compliance.policy-conflict:maximal:policy-conflict-source-code-boundary+policy-conflict-license-compliance-context+policy-conflict-evidence-receipt.

Declared predicates: policy-conflict-source-code-boundary: `allowed_licenses` is nonempty (a string or array); policy-conflict-license-compliance-context: `restricted_licenses` is nonempty (a string or array); policy-conflict-evidence-receipt: `ignore_license_conflicts` equals false.
