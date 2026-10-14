# product-security.license-compliance.policy-conflict — identity

policy conflict owns license-compliance.policy-conflict. Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Keep sibling services in license-compliance under their own verdicts. Tie acceptance to the configured input at `rig-services/product-security.license-compliance.policy-conflict.json`; malformed input is still attributed to that path.

Disposition: convention. Read the limit: policy conflict configuration validation only; declared policy does not prove running policy conflict behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.license-compliance.policy-conflict:policy-boundary. Given source-code is present and license-compliance.policy-conflict is selected, pass only when the repository binding evaluates license-compliance.policy-conflict and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern.
