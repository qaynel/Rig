# product-security.license-compliance.policy-conflict — mid

Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: policy-conflict-source-code-boundary, policy-conflict-license-compliance-context.

Acceptance target: policy:product-security.license-compliance.policy-conflict:mid:policy-conflict-source-code-boundary+policy-conflict-license-compliance-context.

Declared predicates: policy-conflict-source-code-boundary: `allowed_licenses` is nonempty (a string or array); policy-conflict-license-compliance-context: `restricted_licenses` is nonempty (a string or array).
