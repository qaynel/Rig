# product-security.license-compliance.policy-conflict — identity

Policy grade: policy-conflict owns license-compliance.policy-conflict. Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Input: `rig-services/product-security.license-compliance.policy-conflict.json`. Configuration validation only, so it confirms allowed licenses, restricted licenses and the ignore-conflict flag are declared; it does not scan components.

Disposition: executable.
Acceptance target: policy:product-security.license-compliance.policy-conflict:minimal:policy-conflict-source-code-boundary.
Declared predicates: policy-conflict-source-code-boundary: `allowed_licenses` is nonempty (a string or array).
