# product-security.license-compliance.policy-conflict — behavior-oracle slice

Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Policy grade slice `policy-conflict-slice-behavior-oracle`: List the licenses the distribution policy allows. With no list every license is unchecked, so name them. Despite its name this slice is not a behavior oracle: it confirms allowed licenses, restricted licenses and the ignore-conflict flag are declared; it does not scan components.
