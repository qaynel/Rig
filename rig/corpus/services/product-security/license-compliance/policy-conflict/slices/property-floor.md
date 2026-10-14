# product-security.license-compliance.policy-conflict — property-floor slice

Policy grade slice. This slice bounds policy conflict to license-compliance.policy-conflict. It uses `policy-conflict-slice-property-floor` and checks allowed_licenses (nonempty): allowed licenses must name the concrete repository contract..

For policy conflict, choose a repository example that satisfies allowed_licenses at the property-floor floor, plus a failure where allowed licenses must name the concrete repository contract. is false. For policy conflict, wire `property-floor` to `rig-services/product-security.license-compliance.policy-conflict.json` and keep its verdict on allowed_licenses; missing evidence is a named gap, with ceiling policy conflict configuration validation only; declared policy does not prove running policy conflict behavior. Choose a repository-owned check that observes policy conflict from rig-services/product-security.license-compliance.policy-conflict.json..

Service-specific evidence cues:
Offer: Evaluate component licenses against the explicit distribution policy. Conflicting or unknown licensing needs review rather than silently expanding the allow list.
minimal: allowed licenses — ["MIT","Apache-2.0"].
mid: restricted licenses — ["AGPL-3.0-only"].
maximal: ignore license conflicts — false.
