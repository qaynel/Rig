# development.documentation.adrs — property-floor slice

This slice bounds adrs to documentation.adrs. It uses `adrs-slice-property-floor` and checks decision (nonempty): decision must name the concrete repository contract..

Start from a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.documentation.adrs.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than adrs configuration validation only; declared policy does not prove running adrs behavior. Select an approved repository-owned command to verify that behavior.
