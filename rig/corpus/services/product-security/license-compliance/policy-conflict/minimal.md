# product-security.license-compliance.policy-conflict — minimal

Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Policy grade, minimal: List the licenses the distribution policy allows. With no list every license is unchecked, so name them. Binding checks: policy-conflict-source-code-boundary.

Acceptance target: policy:product-security.license-compliance.policy-conflict:minimal:policy-conflict-source-code-boundary.
Declared predicates: policy-conflict-source-code-boundary: `allowed_licenses` is nonempty (a string or array).
