# product-security.license-compliance.policy-conflict — floor and mutation-floor slice

Policy grade slice. This slice bounds policy conflict to license-compliance.policy-conflict. It uses `policy-conflict-slice-floor` and checks allowed_licenses (nonempty): allowed licenses must name the concrete repository contract..

Inspect a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.license-compliance.policy-conflict.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than policy conflict configuration validation only; declared policy does not prove running policy conflict behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Owned scope: `license-compliance.policy-conflict`.

Offer: Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.

Input: `rig-services/product-security.license-compliance.policy-conflict.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: policy conflict configuration validation only; declared policy does not prove running policy conflict behavior. Select an approved repository-owned command to verify that behavior.

minimal: allowed licenses — ["MIT","Apache-2.0"].

mid: restricted licenses — ["AGPL-3.0-only"].

maximal: ignore license conflicts — false.
