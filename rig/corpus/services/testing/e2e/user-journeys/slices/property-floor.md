# testing.e2e.user-journeys — property-floor slice

This slice bounds user journeys to e2e.user-journeys. It uses `user-journeys-slice-property-floor` and checks journeys (nonempty): journeys must name the concrete repository contract..

Read a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.e2e.user-journeys.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than user journeys configuration validation only; declared policy does not prove running user journeys behavior. Select an approved repository-owned command to verify that behavior.
