# policy conflict

Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Owned scope: `license-compliance.policy-conflict`.

Offer: Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Input: `rig-services/product-security.license-compliance.policy-conflict.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: policy conflict configuration validation only; declared policy does not prove running policy conflict behavior. Select an approved repository-owned command to verify that behavior.

minimal: allowed licenses — ["MIT","Apache-2.0"].

mid: restricted licenses — ["AGPL-3.0-only"].

maximal: ignore license conflicts — false.

