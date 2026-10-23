# product-security.license-compliance.policy-conflict — maximal

Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Policy grade, maximal: Set ignoring license conflicts to false. Conflicting or unknown licenses need review instead of expanding the allow list silently. Cumulative with minimal and mid. Binding checks: policy-conflict-source-code-boundary, policy-conflict-license-compliance-context, policy-conflict-evidence-receipt.

Acceptance target: policy:product-security.license-compliance.policy-conflict:maximal:policy-conflict-source-code-boundary+policy-conflict-license-compliance-context+policy-conflict-evidence-receipt.
Declared predicates: policy-conflict-source-code-boundary: `allowed_licenses` is nonempty (a string or array); policy-conflict-license-compliance-context: `restricted_licenses` is nonempty (a string or array); policy-conflict-evidence-receipt: `ignore_license_conflicts` equals false.
