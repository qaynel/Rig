# product-security.license-compliance.policy-conflict — property-floor slice

Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Policy grade slice. This slice bounds policy conflict to license-compliance.policy-conflict. It uses `policy-conflict-slice-property-floor` and checks allowed_licenses (nonempty): allowed licenses must name the concrete repository contract.