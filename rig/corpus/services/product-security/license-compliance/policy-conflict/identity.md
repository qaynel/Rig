# product-security.license-compliance.policy-conflict — identity

Policy grade: policy conflict owns license-compliance.policy-conflict. Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Keep sibling services in license-compliance under their own verdicts. Tie acceptance to the configured input at `rig-services/product-security.license-compliance.policy-conflict.json`; malformed input is still attributed to that path.

Disposition: convention. Read the limit: policy conflict configuration validation only; declared policy does not prove running policy conflict behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.license-compliance.policy-conflict:policy-boundary. Given source-code is present and license-compliance.policy-conflict is selected, pass only when the repository binding evaluates license-compliance.policy-conflict and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent license compliance concern.

Service-specific evidence cues:
Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Owned scope: `license-compliance.policy-conflict`.

Offer: Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Input: `rig-services/product-security.license-compliance.policy-conflict.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: policy conflict configuration validation only; declared policy does not prove running policy conflict behavior. Select an approved repository-owned command to verify that behavior.

minimal: allowed licenses — ["MIT","Apache-2.0"].

mid: restricted licenses — ["AGPL-3.0-only"].

maximal: ignore license conflicts — false.
