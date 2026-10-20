# product-security.license-compliance.policy-conflict — identity

Policy grade: policy conflict owns license-compliance.policy-conflict. Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Keep neighboring license-compliance services outside the policy conflict decision for license-compliance.policy-conflict. Tie acceptance to the configured input at `rig-services/product-security.license-compliance.policy-conflict.json`; malformed input is still attributed to that path.

Disposition: executable. Read the limit: policy conflict configuration validation only; declared policy does not prove running policy conflict behavior. Choose a repository-owned check that observes policy conflict from rig-services/product-security.license-compliance.policy-conflict.json.

Acceptance target: policy:product-security.license-compliance.policy-conflict:minimal:policy-conflict-source-code-boundary.

Declared predicates: policy-conflict-source-code-boundary: `allowed_licenses` is nonempty (a string or array).
