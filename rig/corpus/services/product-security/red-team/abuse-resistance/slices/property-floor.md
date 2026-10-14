# product-security.red-team.abuse-resistance — property-floor slice

This slice bounds abuse resistance to red-team.abuse-resistance. It uses `abuse-resistance-slice-property-floor` and checks abuse_cases (nonempty): abuse cases must name the concrete repository contract..

Use a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.red-team.abuse-resistance.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than abuse resistance configuration validation only; declared policy does not prove running abuse resistance behavior. Select an approved repository-owned command to verify that behavior.
