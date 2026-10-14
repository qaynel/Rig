# product-security.license-compliance.license-diff — behavior-oracle slice

This slice bounds license diff to license-compliance.license-diff. It uses `license-diff-slice-behavior-oracle` and checks previous_inventory (nonempty): previous inventory must name the concrete repository contract..

Start from a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.license-compliance.license-diff.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than license diff configuration validation only; declared policy does not prove running license diff behavior. Select an approved repository-owned command to verify that behavior.
