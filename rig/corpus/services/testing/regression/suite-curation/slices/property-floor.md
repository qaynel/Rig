# testing.regression.suite-curation — property-floor slice

This slice bounds suite curation to regression.suite-curation. It uses `suite-curation-slice-property-floor` and checks retained_suites (nonempty): retained suites must name the concrete repository contract..

Inspect a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.regression.suite-curation.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than suite curation configuration validation only; declared policy does not prove running suite curation behavior. Select an approved repository-owned command to verify that behavior.
