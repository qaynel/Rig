# product-security.license-compliance.policy-conflict — property-floor slice

This slice bounds policy conflict to license-compliance.policy-conflict. It uses `policy-conflict-slice-property-floor` and checks allowed_licenses (nonempty): allowed licenses must name the concrete repository contract..

Anchor the review on a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.license-compliance.policy-conflict.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than policy conflict configuration validation only; declared policy does not prove running policy conflict behavior. Select an approved repository-owned command to verify that behavior.
