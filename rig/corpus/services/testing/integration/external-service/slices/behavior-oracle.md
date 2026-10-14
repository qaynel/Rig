# testing.integration.external-service — behavior-oracle slice

This slice bounds external service to integration.external-service. It uses `external-service-slice-behavior-oracle` and checks external_contracts (nonempty): external contracts must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.integration.external-service.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than external service configuration validation only; declared policy does not prove running external service behavior. Select an approved repository-owned command to verify that behavior.
